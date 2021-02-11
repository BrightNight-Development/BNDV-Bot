module.exports.config = {
    name: "join",
    alias: "j",
    type: "music",
    description: "This Command can be used to make me join your channel."
}

module.exports.run = async (client, message, args) => {

    if(!message.member.voice.channel) return message.channel.send('Senpai, you are not in a Voice Channel!');

    if(message.guild.me.voice.channel) return message.channel.send('Senpai, I\'m already in a Voice Channel... Baka!');

    message.member.voice.channel.join();

}