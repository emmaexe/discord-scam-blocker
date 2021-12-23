const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require('../config.json')
const functions = require('../functions.js')
const mongo = require('mongodb')
const MongoClient = new mongo.MongoClient(process.env.mongo_url)
require('dotenv').config()

module.exports = {
    help: true,
    cooldown: 7500,
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription(`Manage the bot's settings.`)
        .addSubcommand(command => command
            .setName('bot-enabled')
            .setDescription('Should the bot be enabled for this guild?')
            .addBooleanOption(option => option
                .setName('enabled')
                .setDescription('Enabled or disabled.')
                .setRequired(true)
            )
        )
        .addSubcommand(command => command
            .setName('set-channels')
            .setDescription('Set the channels up. Running the command without channels selected will remove unselected channels.')
            .addChannelOption(option => option
                .setName('logs')
                .setDescription('Select channel to be used for logging actions the bot takes.')
                .setRequired(false)
                .addChannelType(0)
            )
        )
        ,
    async execute(client, interaction) {
        if (!interaction.member.permissions.has('MANAGE_GUILD') || !interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({content:"``This command requires the ADMINISTRATOR or MANAGE_GUILD permissions.``", ephemeral: true})
        }



        const qfilter = { guildid: interaction.guild.id }
        if (interaction.options.getSubcommand() == "bot-enabled") {
            let state = interaction.options.getBoolean('enabled')

            await MongoClient.connect()
            const db = MongoClient.db()

            db.collection('config').findOne(qfilter, async function(err, res) {
                if (err) throw err;
                if (res == null) {
                    db.collection('config').insertOne({guildid: interaction.guild.id, enabled: state}, function(err, res) {
                        if (err) throw err;
                        MongoClient.close()
                    })
                } else {
                    await db.collection('config').updateOne(qfilter, { $set: { enabled: state } })
                    MongoClient.close()
                }
                interaction.reply({content:`Updated bot-enabled to ${state}.`,ephemeral:true})
            })
        } else if(interaction.options.getSubcommand() == "set-channels") {
            let logs = undefined; if (interaction.options.getChannel('logs')) logs = interaction.options.getChannel('logs').id;

            await MongoClient.connect()
            const db = MongoClient.db()

            db.collection('config').findOne(qfilter, async function(err, res) {
                if (err) throw err;
                if (res == null) {
                    db.collection('config').insertOne({guildid: interaction.guild.id, log_channel: logs}, function(err, res) {
                        if (err) throw err;
                        MongoClient.close()
                    })
                } else {
                    await db.collection('config').updateOne(qfilter, { $set: { log_channel: logs } })
                    MongoClient.close()
                }
                interaction.reply({content:`Updated logs to ${logs}.`,ephemeral:true})
            })            
        }
    },
};