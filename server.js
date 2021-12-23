require('dotenv').config()
const logging = require('./consoleFormatting.js'); logging.log(); logging.warn(); logging.error(); logging.info();
const fs = require('fs');
const mongo = require('mongodb')
const MongoClient = new mongo.MongoClient(process.env.mongo_url)
const functions = require('./functions.js')
const https = require('https')
const schedule = require('node-schedule');
const config = require('./config.json')
const Discord = require("discord.js")
const allIntents = new Discord.Intents(32767);
const client = new Discord.Client({
    intents: allIntents
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}.`);
    client.user.setActivity(`over ${client.guilds.cache.size} servers.`, {
        type: "WATCHING"
    })
    client.commands = new Discord.Collection();
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.data.name, command);
    }
    const deployCommands = require(`./slashCommands.js`);
    client.guilds.fetch().then(async (guilds) => {
        guilds.forEach(async (guild) => {
            deployCommands.deploy(client, client.user.id, guild.id, false)
        })
        console.log(`Successfully registered application commands and applied command premissions for ${guilds.size} guilds.`)
    })
    functions.blacklistUpdate();
})
client.on('guildCreate', (guild) => {
    const deployCommands = require(`./slashCommands.js`);
    deployCommands.deploy(client, client.user.id, guild.id, false)
})

client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
        functions.statistics.increaseButtonCount()
        try {
            let buttonFile = require(`./buttons/${interaction.customId}.js`);
            buttonFile.execute(client, interaction)
        } catch (err) {
            return console.log(err);
        }
    } else if (interaction.isSelectMenu()) {
        functions.statistics.increaseSelectMenuCount()
        try {
            let menuFile = require(`./menu/${interaction.customId}.js`);
            menuFile.execute(client, interaction)
        } catch (err) {
            return console.log(err);
        }
    } else if (interaction.isCommand()) {
        functions.statistics.increaseCommandCount()
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        let now = Date.now()
        const qfilter = {
            guildid: interaction.guild.id,
            command: interaction.commandName
        }
        if (command.cooldown) {
            await MongoClient.connect()
            const db = MongoClient.db()
            await db.collection('cooldown').findOne(qfilter, async function (err, res) {
                if (err) throw err;
                let nextAvailable;
                if (res != null) {
                    nextAvailable = res.value;
                }
                if (nextAvailable == undefined) nextAvailable = 0;
                if (nextAvailable - now > 0) {
                    await interaction.reply({
                        content: `**Command on cooldown! Please wait *${(nextAvailable-now)/1000}* more seconds.**`,
                        ephemeral: true
                    });
                } else {
                    try {
                        await command.execute(client, interaction);
                        const db = MongoClient.db()
                        db.collection('cooldown').findOne(qfilter, async function (err, res) {
                            if (err) throw err;
                            if (res == null) {
                                db.collection('cooldown').insertOne({
                                    guildid: interaction.guild.id,
                                    command: interaction.commandName,
                                    value: now + command.cooldown
                                }, function (err, res) {
                                    if (err) throw err;
                                    MongoClient.close()
                                    return;
                                })
                            } else {
                                await db.collection('cooldown').updateOne(qfilter, {
                                    $set: {
                                        value: now + command.cooldown
                                    }
                                })
                                MongoClient.close()
                                return;
                            }
                        })        
                    } catch (error) {
                        console.error(error);
                        return interaction.reply({
                            content: '**There was an error while executing this command!**\n*No more info is available.*',
                            ephemeral: true
                        });
                    }
                }
            })
        } else {
            try {
                await command.execute(client, interaction);
            } catch (error) {
                console.error(error);
                return interaction.reply({
                    content: '**There was an error while executing this command!**\n*No more info is available.*',
                    ephemeral: true
                });
            }
        }
    }
});

client.on('messageCreate', async (message) => {
    await MongoClient.connect()
    const db = MongoClient.db()
    const qfilter = {
        guildid: message.guild.id
    }
    db.collection('config').findOne(qfilter, async function (err, res) {
        if (err) throw err;
        if (res == null) {res = { enabled: false, log_channel: undefined }};
        if (message.author.id != client.user.id && message.author.bot != true && res.enabled == true) {
            let list = require('./blacklist.json')
            let send = false
            let desc = `**User:** <@${message.author.id}> **-** ${message.author.tag} **-** ${message.author.id}\n**Message:** \`\`${message.content}\`\`\n**Matches:** `
            for (let i = 0; i < list.length; i++) {
                let link = list[i]
                if (link[link.length - 1] != '/') link += '/'
                if (message.content.includes(link)) {
                    send = true;
                    desc += `\`\`${list[i]}\`\` `;
                }
            }
            if (send == true) {
                if (res.log_channel != undefined) {
                    let url = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`
                    let embed = new Discord.MessageEmbed()
                        .setTitle("<:warning_emoji:868054485992357948> Message deleted - malicious URL found")
                        .setDescription(desc + `\n[Jump to channel](${url})`)
                        .setColor(config.colours.warning)
                        .setTimestamp()
                    let logchannel = await client.channels.fetch(res.log_channel)
                    logchannel.send({
                        embeds: [embed]
                    })
                }
                message.delete()
                functions.statistics.increaseBlockedScamsCount()
            }
        }

    })
});

client.login(process.env.token)

const blacklistUpdateJob = schedule.scheduleJob(config.scheduledEvents.blacklistUpdate, function(){functions.blacklistUpdate()});