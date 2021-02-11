module.exports.config = {
    name: "skip",
    alias: "s",
    type: "music",
    description: "This Command can be used to skip a song."
}

module.exports.run = async (client, message, args, ops) => {

    if(!message.member.voice.channel) return message.channel.send('You are not in a Voice Channel.');

    let active = ops.active;

    let fetched = active.get(message.guild.id);

    if (message.member.id === '219191061199847424') {
        message.channel.send('Successfully skipped!');

        return fetched.dispatcher.emit('finish');
    }

    if(!fetched) return message.channel.send('There isn\'t any music playing, baka!');

    if(message.member.voice.channel !== message.guild.me.voice.channel) return message.channel.send('You are not in my channel, Senpai');

    let userCount = message.member.voice.channel.members.size;

    let required = Math.ceil(userCount/2);

    if(!fetched.queue[0].voteSkips) fetched.queue[0].voteSkips = [];

    if(fetched.queue[0].voteSkips.includes(message.member.id)) return message.channel.send('Senpai, you can only vote one time per song!');

    fetched.queue[0].voteSkips.push(message.member.id);

    ops.active.set(message.guild.id, fetched);

    if(fetched.queue[0].voteSkips.length >= required){
        message.channel.send('Successfully skipped!');

        return fetched.dispatcher.emit('finish');
    }
    
    message.channel.send('Successfully voted. ' + fetched.queue[0].voteSkips.length + '/' + required);

}