module.exports.config = {
    name: "loop",
    alias: "",
    type: "music",
    description: "Use this Command to Loop either a Song or the Queue."
}

module.exports.run = async (client, message, args, ops) => {

    
    if(!message.member.voice.channel) return message.channel.send('You are not in a Voice Channel.');

    if(ops.loop.get(message.guild.id) === '0'){

        ops.loop.set(message.guild.id, '1');

        message.channel.send('The current song is now being looped!');

    } else if (ops.loop.get(message.guild.id) === '1'){

        ops.loop.set(message.guild.id, '2');

        message.channel.send('The Playlist is now being looped!');

    } else {
        
        ops.loop.set(message.guild.id, '0');

        message.channel.send('The song will no longer be looped!');

    }

}