<h1 align="center">Setting the bot up</h1>

## Enviromental variables

Enviromental variables are used for saving sensitive data (e.g. your discord token).

To handle enviromental variables the project uses the [dotenv](https://www.npmjs.com/package/dotenv) npm package.

You must create a ".env" file in the root of the project and create all the necessary variables for the bot to function.

You can find more info on how to do that [here](https://www.npmjs.com/package/dotenv).

Variables that must be created in order for the bot to function:

**"token"** - contains your discord bot's token.

**"mongo_url"** - contains the URL of your MongoDB installation. You must include the database name after the URL so the project knows where to save data (e.g. mongodb://localhost:27017/discord-scam-blocker; mongodb://localhost:27017/ being the URL and discord-scam-blocker the database name.)

## Additional confirugation - config.json file

The **config.json** file is used for saving less sesitive configuration data.

```json

{
    "colours": {
        "main":"00FFF0",
        "secondary":"00AFFF",
        "success":"00FF50",
        "warning":"FFFF10",
        "error":"FF1F00"
    },
    "scheduledEvents": {
        "blacklistUpdate": "*/15 * * * *"
    },
    "url": {
        "scamLinkBlacklist": "https://raw.githubusercontent.com/BuildBot42/discord-scam-links/main/list.txt"
    }
}

```

**colours** is an object containing HEX values for various colours the bot uses. You can change these if you do not like the default ones.

**scheduledEvents** contains strings for various repeating scheduled tasks that are used by [node-schedule](https://www.npmjs.com/package/node-schedule). They are formatted like this:

```txt
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
```

- **blacklistUpdate**
Is used by the bot to determine the interval of time that should pass between every update of the blacklist.
The default is 15 minutes (**\*/15 \* \* \* \***) meaning the blacklist will be updated every hour 4 times: at XX:00, XX:15, XX:30 and XX:45. If set to **\*/30 \* \* \* \*** it will update every hour 2 times: at XX:00 and XX:30.
For more complex configuration check the module's [repository on npmjs.com](https://www.npmjs.com/package/node-schedule).

**url** contains various URL's the bot uses.

- **scamLinkBlacklist** is the URL of the blacklist. By default the bot uses [BuildBot42](https://www.github.com/BuildBot42/)'s repository. This option permits you to change where the bot downloads its blacklist from.

## MongoDB

This project requires an installation of MongoDB to function.

You can get a community server [here](https://www.mongodb.com/try/download/community).

You could alternatively also use [MongoDB atlas](https://www.mongodb.com/atlas).

The project uses [the official MongoDB module](https://www.npmjs.com/package/mongodb) to interact with the database.

The URL to the installation of the DB must contain the name of the database for it to function (check the Enviromental variables section for more info)
