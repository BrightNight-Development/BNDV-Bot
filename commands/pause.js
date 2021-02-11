module.exports.config = {
    name: "pause",
    alias: "",
    type: "music",
    description: "This Command can be used to pause the song."
}

module.exports.run = async (client, message, args, ops) => {
    
    if(!message.member.voice.channel) return message.channel.send('You are not in a Voice Channel.');

    let active = ops.active;

    let fetched = active.get(message.guild.id);

    if(!fetched) return message.channel.send('I\'m not playing music, Baka!');
    
    if(message.member.voice.channel !== message.guild.me.voice.channel) return message.channel.send('You are not in my channel, Senpai');

    if(fetched.dispatcher.paused) return message.channel.send('The music is already paused, baka!');

    fetched.dispatcher.pause();

    message.channel.send('Paused!');

}