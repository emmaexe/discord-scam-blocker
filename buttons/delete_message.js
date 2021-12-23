const Discord = require('discord.js')

module.exports = {
    async execute(client, interaction) {
        interaction.message.delete()
        interaction.reply({content: "Deleted.", ephemeral: true})
    }
}