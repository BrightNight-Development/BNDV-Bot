module.exports.config = {
    name: "yt-search",
    alias: "search",
    type: "music",
    description: "Dieser Command kann benutzt werden um ein Lied auf YouTube zu suchen."
}

const search = require('yt-search');

module.exports.run = async (client, message, args, ops) => {

    if(!message.member.voice.channel) return message.channel.send('You are not in a Voice Channel.');

    search(args.join(' '), function (err, res) {

        if(err) return message.channel.send('Etwas ist ist fehlgeschlagen... Diesmal bin ich ein baka :c');

        let videos = res.videos.slice(0, 10);

        let resp = '';
        for (var i in videos){
        
            resp += `\n**[${parseInt(i)+1}]:** \`${videos[i].title}\``;

        }
        resp += `\n**Such dir eine Zahl zwischen \`1 und ${videos.length}\` aus`;

        message.channel.send(resp);

        const filter = m => !isNaN(m.content) && m.content < videos.length+1 && m.content > 0;

        const collector = message.channel.createMessageCollector(filter);

        collector.videos = videos;

        collector.once('collect', function(m){

            let play = require('./play.js');
            play.run(client, message, [this.videos[parseInt(m.content)-1].url], ops);

        });

    });

}