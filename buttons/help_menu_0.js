require('dotenv').config()
const Discord = require('discord.js')
const mongo = require('mongodb')
const MongoClient = new mongo.MongoClient(process.env.mongo_url)
const config = require('../config.json')
const package = require('../package.json')

module.exports = {
    async execute(client, interaction) {
        let buttonFoward = new Discord.MessageButton()
            .setStyle(2)
            .setEmoji('<:rightarrow:916627829255462932>')
            .setCustomId('help_menu_1')
        let buttonBackwards = new Discord.MessageButton()
            .setStyle(2)
            .setEmoji('<:leftarrow:916627829372895262>')
            .setCustomId('undefined')
            .setDisabled(true)
        let row = new Discord.MessageActionRow()
            .addComponents(buttonBackwards, buttonFoward)

        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        await MongoClient.connect()
        const db = MongoClient.db()
        db.collection('statistics').find({}).toArray(function (err, res) {
            if (err) throw err;
            let countCommands = res.find(obj => obj.sid === 'countCommands'); if (countCommands==null) {countCommands = 0} else {countCommands = countCommands.value};
            let countButtons = res.find(obj => obj.sid === 'countButtons'); if (countButtons==null) {countButtons = 0} else {countButtons = countButtons.value};
            let countSelectMenu = res.find(obj => obj.sid === 'countSelectMenu'); if (countSelectMenu==null) {countSelectMenu = 0} else {countSelectMenu = countSelectMenu.value};
            let countBlockedScams = res.find(obj => obj.sid === 'countBlockedScams'); if (countBlockedScams==null) {countBlockedScams = 0} else {countBlockedScams = countBlockedScams.value};
            const embed = new Discord.MessageEmbed()
                .setColor(config.colours.main)
                .setTimestamp()
                .setTitle(`**ScamBlocker v${package.version}**`)
                .addField("Uptime", `:clock2: ${days}d ${hours}h ${minutes}m ${seconds}s`, true)
                .addField("Scams blocked", `<:criminal:923652209336549408> ${countBlockedScams}`, true)
                .addField("Servers", `<:server:916630567099973692> ${client.guilds.cache.size}`, true)
                .addField("Channels", `:file_folder: ${client.channels.cache.size}`, true)
                .addField("Users", `:bust_in_silhouette: ${client.users.cache.size}`, true)
                .addField("Emoji", `<:KannaSip:889543061821063189> ${client.emojis.cache.size}`, true)
                .addField("Commands ran", `<:slash:913172347639435285> ${countCommands}`, true)
                .addField("Buttons pressed", `<:button:913172562001928193> ${countButtons}`, true)
                .addField("Select menu's used", `<:dropdown_select:914106174754947113> ${countSelectMenu}`, true)
                .addField("Bot repository", `<:github:888155742719328276> [GitHub](https://github.com/MCUniversity/discord-scam-blocker)`, true)
                .addField("Bot library", "[**Discord.js v13**](https://discord.js.org/#/docs/main/)", true)
                .addField("Bot account created on", `${client.user.createdAt}`)
                .setThumbnail(client.user.displayAvatarURL())
                .setFooter('Developed by @MCUniversity#0859')
            if (!interaction.guild.roles.everyone.permissions.has(Discord.Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) {
                if (!interaction.channel.permissionsFor(interaction.guild.roles.everyone).has(Discord.Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) {
                    embed.addField(':warning: External emoji could not be displayed!', 'For external emoji to be displayed properly within slash commands, the @everyone role in your server needs to have the "Use External Emoji" permission.')
                }
            }
            if (!interaction.channel.permissionsFor(interaction.guild.roles.everyone).serialize().USE_EXTERNAL_EMOJIS && interaction.guild.roles.everyone.permissions.has(Discord.Permissions.FLAGS.USE_EXTERNAL_EMOJIS)) {
                embed.addField(':warning: External emoji could not be displayed!', 'For external emoji to be displayed properly within slash commands, the @everyone role in your server needs to have the "Use External Emoji" permission.')
            }
            interaction.update({
                embeds: [embed],
                components: [row]
            });
            MongoClient.close()
        });
        
    }
}