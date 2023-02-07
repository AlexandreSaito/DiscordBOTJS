const discordClient = require('./discordClient.js');

const ready = require('./discordEvents/ready.js');
const interacton = require('./discordEvents/interaction.js');
const voiceState = require('./discordEvents/voiceStateUpdate.js');
const messageCreate = require('./discordEvents/messageCreate.js');

// interaction struct
// https://discord.js.org/#/docs/main/main/class/ChatInputCommandInteraction

//https://discord.js.org/#/docs/discord.js/main/class/CommandInteraction?scrollTo=command

// https://discord.js.org/#/docs/main/main/class/Message

var client;
var encherOSaco = false;

function startBot() {

	client = discordClient.startClient();

	client.on('ready', () => {
		ready.onReady();
	});

	// only pinged can see - ephemeral: true
	client.on('interactionCreate', async interaction => {
		await interacton.onInteraction(interaction);
	});

	client.on("messageCreate", (message) => {
		messageCreate.onMessageCreate(message);
	});

	client.on('voiceStateUpdate', (oldState, newState) => {
		voiceState.onVoiceStateUpdate(oldState, newState);
	});

	client.on('debug', console.log);

}

module.exports = { startBot, encherOSaco }
