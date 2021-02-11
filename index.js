const { Client } = require('discord.js');
const client = new Client();

const config = require('./config.js');

let active = new Map();
let loop = new Map();

client.on('ready', () => {
    let ops = {
        config: config,
        active: active,
        loop: loop
    }

    let onMessage = require('./onReady.js');
    onMessage.register(client, ops);
});

client.login(config.token);