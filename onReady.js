const {
    Collection,
    MessageEmbed
} = require('discord.js');
const fs = require('fs');

module.exports.register = async (client, ops) => {
    let prefix = ops.config.prefix;
    client.commands = new Collection();
    client.alias = new Collection();
    client.types = new Collection();

    fs.readdir("./commands/", (err, files) => {
        if (err) console.log(err);

        let jsfile = files.filter(f => f.split(".").pop() === "js");

        if (jsfile.length <= 0) {
            return console.log("No commands there.");
        }

        jsfile.forEach((file, i) => {
            let pullcmd = require(`./commands/${file}`);
            client.commands.set(pullcmd.config.name, pullcmd);
            client.alias.set(pullcmd.config.alias, pullcmd.config.name);
            client.types.set(pullcmd.config.type, pullcmd.config.name);
            console.log(`| ${file} loaded |`);
        });
    });

    client.on('message', message => {
        if(message.author.bot) return;    
        let messageArray = message.content.split(" ")
        let cmd = messageArray[0]
        let args = messageArray.slice(1)
        if (!message.content.startsWith(prefix)) return modMail(client, message);
        let commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.alias.get(cmd.slice(prefix.length)))
        if (commandfile) commandfile.run(client, message, args, ops);
    });
}

modMail = async (client, message) => {
    if(message.guild === null) return directMessage(client, message);
    let channels = JSON.parse(fs.readFileSync('./commands/jsons/modMail/channel.json', 'utf-8'));
    if(channels[message.channel.id]) return modMailChannel(client, message, channels);
}

modMailChannel = async (client, message, channels) => {
    let user = client.users.cache.find(user => user.id == channels[message.channel.id].user);
    let emb = new MessageEmbed()
    .setTitle("BNDV Support")
    .setFooter(message.author.tag)
    .setDescription(message.content)
    .setColor(1752220)
    user.send(emb);
}

directMessage = async(client, message) => {

    let userJson = JSON.parse(fs.readFileSync('./commands/jsons/modMail/user.json', 'utf-8'));
    if(!userJson[message.author.id]){
        var server = client.guilds.cache.find(guild => guild.name === 'BrightNight-Development');
        await server.channels.create(message.author.tag)
        .then(channel => {
            let category = server.channels.cache.find(c => c.name == "Mod Mail" && c.type == "category");

            if (!category) throw new Error("Category channel does not exist");
            channel.setParent(category.id);
            userJson[message.author.id] = {
                channel: channel.id
            }
        });

        let channel = client.channels.cache.find(c => c.id === userJson[message.author.id].channel);
        let emb = new MessageEmbed()
        .setColor(1752220)
        .setTitle(message.author.tag)
        .setDescription(message.content)
        channel.send(emb);

        let channels = JSON.parse(fs.readFileSync('./commands/jsons/modMail/channel.json', 'utf-8'));
        channels[channel.id] = {
            user: message.author.id
        }

        fs.writeFileSync('./commands/jsons/modMail/channel.json', JSON.stringify(channels), (err) => {
            if(err) console.log(err);
        });

        fs.writeFileSync('./commands/jsons/modMail/user.json', JSON.stringify(userJson), (err) => {
            if(err) console.log(err);
        });

    }

}

getCommand = async (message, prefix) => {
    let raw = message.content.slice(prefix.length).split(' ').trim();
    let command = raw[0];
    return command;
}

getArguments = async (message, prefix, command) => {
    let raw = message.content.slice(prefix.length).split(' ').trim();
    raw2 = raw.join(' ');
    raw3 = raw2.slice(command.length).split(' ').trim();
    return raw3;
}