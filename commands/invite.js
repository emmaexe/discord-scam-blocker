const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js')
const config = require('../config.json')
const functions = require('../functions.js')

module.exports = {
    help: true,
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription(`Invite the bot to your discord server.`),
    async execute(client, interaction) {
        let inviteButton = new Discord.MessageButton()
            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=137976212544&scope=bot%20applications.commands`)
            .setStyle("LINK")
            .setLabel('Invite')
        let row = new Discord.MessageActionRow()
            .addComponents(inviteButton)
        let embed = new Discord.MessageEmbed()
            .setColor(config.colours.main)
            .setTimestamp()
            .setTitle('ScamBlocker bot invite link.')
            .setDescription('Press the invite button to add the bot to your discord server.')
        interaction.reply({embeds: [embed], components: [row], ephemeral: true})
    },
};