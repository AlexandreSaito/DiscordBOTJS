const { Client, REST, Routes, Collection, Events, GatewayIntentBits } = require('discord.js');
const discordCommands = require('./discordCommands.js');

const TOKEN = process.env['DISCORD_TOKEN'];
const CLIENT_ID = process.env['DISCORD_CLIENT_ID'];

var client;
var rest;

function startClient(){
	client = new Client({
		autoReconnect: true,
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildVoiceStates,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent,
			//GatewayIntentBits.AutoModerationConfiguration,
			//GatewayIntentBits.DirectMessageTyping,
			//GatewayIntentBits.GuildEmojisAndStickers,
			//GatewayIntentBits.AutoModerationExecution,
			//GatewayIntentBits.DirectMessages,
			GatewayIntentBits.GuildIntegrations,
			//GatewayIntentBits.GuildMessageReactions,
			//GatewayIntentBits.GuildPresences,
			//GatewayIntentBits.GuildWebhooks,
			//GatewayIntentBits.DirectMessageReactions,
			//GatewayIntentBits.GuildBans,
			//GatewayIntentBits.GuildInvites,
			GatewayIntentBits.GuildMessageTyping,
			//GatewayIntentBits.GuildScheduledEvents,
		]
	});

	client.commands = new Collection();

	var commands = discordCommands.registerCommands(client.commands);

	// Construct and prepare an instance of the REST module
	rest = new REST({ version: '10' }).setToken(TOKEN);
// and deploy your commands!
	(async () => {
		try {
			console.log(`Started refreshing ${commands.length} application (/) commands.`);

			// The put method is used to fully refresh all commands in the guild with the current set
			let data = await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

			console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		} catch (error) {
			// And of course, make sure you catch and log any errors!
			console.log("Failed to bind commands!");
			console.error(error);
		}
	})();
	
	console.log("Starting bot...");
	client.login(TOKEN).catch(console.error);
	
	return client;
}

function getClient(){
	return client;
}

module.exports = {
	startClient,
	getClient,
};