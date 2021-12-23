require('dotenv').config()
const https = require('https')
const mongo = require('mongodb')
const MongoClient = new mongo.MongoClient(process.env.mongo_url)
const config = require('./config.json')
const fs = require('fs')

module.exports = {
    async discordTimestampToId(id) {
        return (id / 4194304 + 1420070400000)
    },
    async blacklistUpdate(){
        let url = config.url.scamLinkBlacklist
        https.get(url, (res) => {
            let data = "";
            res.on('data', data_chunk => {
                data += data_chunk;
            })
            res.on('end', async () => {
                let newBlacklist = data.split("\n").filter(e=>e)
                fs.writeFile('blacklist.json', JSON.stringify(newBlacklist), (err) => {
                    if (err) return console.error(err)
                })
            })
        })
    },
    statistics: {
        async increaseButtonCount() {
            await MongoClient.connect()
            const db = await MongoClient.db()
            await db.collection('statistics').findOne({ sid: "countButtons" }, async function(err, res) {
                if (err) throw err;
                if (res == null) {
                    await db.collection('statistics').insertOne({sid: "countButtons", value: 1}, function(err, res) {
                        if (err) throw err;
                        MongoClient.close()
                    })
                } else {
                    await db.collection('statistics').updateOne({ sid: "countButtons" }, { $set: { value: res.value+1 } })
                    MongoClient.close()
                }
            })
        },
        async increaseCommandCount() {
            await MongoClient.connect()
            const db = await MongoClient.db()
            await db.collection('statistics').findOne({ sid: "countCommands" }, async function(err, res) {
                if (err) throw err;
                if (res == null) {
                    await db.collection('statistics').insertOne({sid: "countCommands", value: 1}, function(err, res) {
                        if (err) throw err;
                        MongoClient.close()
                    })
                } else {
                    await db.collection('statistics').updateOne({ sid: "countCommands" }, { $set: { value: res.value+1 } })
                    MongoClient.close()
                }
            })
        },
        async increaseSelectMenuCount() {
            await MongoClient.connect()
            const db = await MongoClient.db()
            await db.collection('statistics').findOne({ sid: "countSelectMenu" }, async function(err, res) {
                if (err) throw err;
                if (res == null) {
                    await db.collection('statistics').insertOne({sid: "countSelectMenu", value: 1}, function(err, res) {
                        if (err) throw err;
                        MongoClient.close()
                    })
                } else {
                    await db.collection('statistics').updateOne({ sid: "countSelectMenu" }, { $set: { value: res.value+1 } })
                    MongoClient.close()
                }
            })
        },
        async increaseBlockedScamsCount() {
            await MongoClient.connect()
            const db = await MongoClient.db()
            await db.collection('statistics').findOne({ sid: "countBlockedScams" }, async function(err, res) {
                if (err) throw err;
                if (res == null) {
                    await db.collection('statistics').insertOne({sid: "countBlockedScams", value: 1}, function(err, res) {
                        if (err) throw err;
                        MongoClient.close()
                    })
                } else {
                    await db.collection('statistics').updateOne({ sid: "countBlockedScams" }, { $set: { value: res.value+1 } })
                    MongoClient.close()
                }
            })
        }
    }
}