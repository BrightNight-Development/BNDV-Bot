const ytdl = require('ytdl-core');
const { MessageEmbed } = require('discord.js');

module.exports.config = {
    name: "play",
    alias: "p",
    type: "music",
    description: "Use n.play [url] to play a song."
}

module.exports.run = async (client, message, args, ops) => {

    if(!message.member.voice.channel) return message.channel.send('You are not in a Voice Channel, Senpai!');

    if(!args[0]) return message.channel.send('Senpai, give me a Name or a URL!');

    let validate = await ytdl.validateURL(args[0]);

    if(!validate){
        let ytSearch = require('./yt-search.js');
        return ytSearch.run(client, message, args, ops);
    }

    let info = await ytdl.getInfo(args[0]);

    let data = ops.active.get(message.guild.id) || {};

    if(!data.connection) data.connection = await message.member.voice.channel.join();
    if(!data.queue) data.queue = [];
    data.guildID = message.guild.id;

    const song = {
        title: info.videoDetails.title,
        url: info.videoDetails.video_url,
    };

    data.queue.push({
        songTitle: song.title,
        requester: message.author.tag,
        url: song.url,
        announceChannel: message.channel.id
    });

    if(!data.dispatcher){
        
        ops.loop.set(message.guild.id, '0')

        play(client, ops, data);
    }
    else
    {
        message.channel.send(`Added to the Queue: ${song.title}`);
    }

    ops.active.set(message.guild.id, data);

}

async function play(client, ops, data){

    client.channels.cache.get(data.queue[0].announceChannel).send(`Now playing: ${data.queue[0].songTitle}`);

    data.dispatcher = await data.connection.play(ytdl(data.queue[0].url, { filter: 'audioonly' }));
    data.dispatcher.guildID = data.guildID;

    data.dispatcher.once('finish', function() {
        finish(client, ops, this);
    });

}

async function queue(client, ops, id){

    let data = ops.active.get(id) || {};

    data.queue.push({
        songTitle: data.queue[0].songTitle,
        requester: data.queue[0].requester,
        url: data.queue[0].url,
        announceChannel: data.queue[0].announceChannel
    });

    data.queue.shift();
    
    ops.active.set(data.guildID, data);

    play(client, ops, data);

}

function finish(client, ops, dispatcher){

    let fetched = ops.active.get(dispatcher.guildID);

    let id = dispatcher.guildID;

    if(ops.loop.get(dispatcher.guildID) === '1') return play(client, ops, fetched);

    if(ops.loop.get(dispatcher.guildID) === '2') return queue(client, ops, id);

    fetched.queue.shift();

    if(fetched.queue.length > 0){

        ops.active.set(dispatcher.guildID, fetched);

        play(client, ops, fetched);

    }else{

        ops.active.delete(dispatcher.guildID);

        let vc = client.guilds.cache.get(dispatcher.guildID).me.voice.channel;
        if(vc) vc.leave();

    }

}