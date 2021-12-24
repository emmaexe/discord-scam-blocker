require('dotenv').config()
module.exports.deploy = async (client, clientId, guildId) => {
    const fs = require('fs');
    const { REST } = require('@discordjs/rest');
    const { Routes } = require('discord-api-types/v9');
    const token = process.env.token
    
    const commands = [];
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.push(command.data.toJSON());
    }
    
    const rest = new REST({ version: '9' }).setToken(token);
    
    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands }).then(async () => {
        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            if (command.permissions) {
                let guild = await client.guilds.cache.get(guildId)
                guild.commands.fetch().then(commands => {
                    let guildCommand = commands.find(cmd => cmd.name == command.data.name)
                    guildCommand.permissions.set({ permissions: command.permissions })
                })
            }
        }
    }).catch(console.error);
}