const chatInputCommand = require('./interaction/chatInputCommand.js');
const stringSelectMenu = require('./interaction/stringSelectMenu.js');
const modalSubmit = require('./interaction/modalSubmit.js');
const button = require('./interaction/button.js');

async function onInteraction(interaction) {
	console.log("interaction", interaction);
	if(interaction.isButton()){
		button.on(interaction);
		return;
	}
	if (interaction.isChatInputCommand()) {
		await chatInputCommand.on(interaction);
		return;
	}
	if (interaction.isStringSelectMenu()) {
		await stringSelectMenu.on(interaction);
		return;
	}
	if(interaction.isModalSubmit()){
		await modalSubmit.on(interaction);
		return;
	}
}

module.exports = {
	onInteraction
};