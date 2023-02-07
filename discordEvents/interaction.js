const discord = require('discord.js');

async function onInteraction(interaction) {
	console.log("interaction", interaction);
	if (!interaction.isChatInputCommand()) return;
	console.log("Interaction options: ", interaction.options);
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
}

module.exports = {
	onInteraction
};