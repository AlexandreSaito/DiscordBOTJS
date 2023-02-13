const dClient = require('./discordClient.js');

const ready = require('./discordEvents/ready.js');
const interacton = require('./discordEvents/interaction.js');
const voiceState = require('./discordEvents/voiceStateUpdate.js');
const messageCreate = require('./discordEvents/messageCreate.js');

// interaction struct
// https://discord.js.org/#/docs/main/main/class/ChatInputCommandInteraction
// https://discord.js.org/#/docs/discord.js/main/class/CommandInteraction?scrollTo=command
// https://discord.js.org/#/docs/main/main/class/Message
// only pinged can see - ephemeral: true

var client;

function startBot() {

	client = dClient.startClient();

	client.on('ready',ready.onReady);
	client.on('interactionCreate', interacton.onInteraction);
	client.on("messageCreate", messageCreate.onMessageCreate);
	client.on('voiceStateUpdate', voiceState.onVoiceStateUpdate);
	client.on('debug', console.log);

}

module.exports = { startBot }
