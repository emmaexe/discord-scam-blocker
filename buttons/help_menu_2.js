const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    async execute(client, interaction) {
        let buttonFoward = new Discord.MessageButton()
            .setStyle(2)
            .setEmoji('<:rightarrow:916627829255462932>')
            .setCustomId('undefined')
            .setDisabled(true)
        let buttonBackwards = new Discord.MessageButton()
            .setStyle(2)
            .setEmoji('<:leftarrow:916627829372895262>')
            .setCustomId('help_menu_1')
        let row = new Discord.MessageActionRow()
            .addComponents(buttonBackwards, buttonFoward)

        const embed = new Discord.MessageEmbed()
            .setColor(config.colours.main)
            .setTimestamp()
            .setTitle("Found a bug? Have a feature request? Need help?")
            .setDescription(`<:DiscordLogoWhite:888158984475918368> [Support server](https://discord.gg/JENqa52)\n<:github:888155742719328276> [GitHub](https://github.com/MCUniversity/discord-scam-blocker)`)
            .setFooter('Developed by @MCUniversity#0859')
        interaction.update({
            embeds: [embed],
            components: [row]
        });
    }
}