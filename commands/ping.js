const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require('../config.json')
const functions = require('../functions.js')

module.exports = {
    help: true,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription(`View the bot's latency.`),
    async execute(client, interaction) {
        let aembed = new Discord.MessageEmbed()
            .setColor(config.colours.main)
            .setTimestamp()
            .addField("**Ping**", `Please wait, calculating ping...`)
        await interaction.reply({embeds: [aembed], allowedMentions: {repliedUser: false}, fetchReply: true})
            .then(async (message) => {
                let messageTimestamp = message.createdTimestamp
                let interactionTimestamp = await functions.discordTimestampToId(interaction.id)
                let embed = new Discord.MessageEmbed()
                    .setColor(config.colours.main)
                    .setTimestamp()
                    .addField("**Ping**", `${Math.round(messageTimestamp) - Math.round(interactionTimestamp)} ms`)
                interaction.editReply({embeds: [embed]})
            })
    },
};