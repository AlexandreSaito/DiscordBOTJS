
// https://discordjs.guide/interactions/select-menus.html#accessing-select-menu-interaction-values

async function on(interaction) {
	await interaction.deferUpdate();
	console.log("[INTERACTION STRING SELECT MENU] CustomId: ", interaction.customId);
}

module.exports = {
	on
};