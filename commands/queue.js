module.exports.config = {
    name: "queue",
    alias: "q",
    type: "music",
    description: "This Command can be used to view the Music Queue."
}

module.exports.run = async (client, message, args, ops) => {

    let active = ops.active;

    let fetched = active.get(message.guild.id);

    if(!fetched) return message.channel.send('There isn\'t any music playing, baka!');

    let queue = fetched.queue;
    let nowPlaying = queue[0];

    let resp = `__**Now Playing**__\n**${nowPlaying.songTitle}**\n\n__**Queue**__\n`;

    for (var i = 1; i < queue.length; i++){
        resp += `${i}. **${queue[i].songTitle}**\n`;
    }

    message.channel.send(resp);
}