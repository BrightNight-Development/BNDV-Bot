module.exports.config = {
    name: "leave",
    alias: "l",
    type: "music",
    description: "This Command can be used to make me leave the channel."
}

module.exports.run = async (client, message, args, ops) => {

    if(!message.member.voice.channel) return message.channel.send('Senpai, you are not in a Voice Channel!');

    if(!message.guild.me.voice.channel) return message.channel.send('Senpai, I\'m not in a Voice Channel... Baka!');

    if(message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send('You fool! You are not in my Voice Channel!');

    message.guild.me.voice.channel.leave();

    message.channel.send('Goodbye, Senpai!');

}