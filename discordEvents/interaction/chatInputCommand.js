
async function on(interaction) {
	console.log("[INTERACTION CHAT INPUT COMMAND] Interaction options: ", interaction.options);
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`[INTERACTION CHAT INPUT COMMAND] No command matching ${interaction.commandName} was found.`);
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
	on
};