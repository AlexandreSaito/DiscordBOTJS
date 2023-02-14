const playlistHandler = require('./../../playlistHandler.js');
const discord = require("discord.js");
// https://discordjs.guide/interactions/buttons.html#component-collectors

async function on(interaction) {
	console.log("[INTERACTION BUTTON] customId: ", interaction.customId);
	if(interaction.customId.startsWith("playlist")){
		await onPlaylistHandler(interaction);
		return;
	}
}

async function onPlaylistHandler(interaction){
	let playlistId = interaction.customId
		.replace("playlist_adicionar_musica", "")
		.replace("playlist_remover_musica", "")
		.replace("playlist_remover_playlist", "");

	let playlistInfo = playlistHandler.getInfoById(playlistId);
	console.log("[INTERACTION BUTTON] PlaylistInfo: ", playlistInfo);
	
	if(interaction.customId.startsWith("playlist_adicionar_musica")){
		const modal = new discord.ModalBuilder()
			.setCustomId(`mdl_playlist_add_musica${playlistId}`)
			.setTitle(`Adicionar musica em ${playlistInfo.name}`);

		let inputUrl = new discord.TextInputBuilder()
			.setCustomId('inputUrl')
		    // The label is the prompt the user sees for this input
			.setLabel("Youtube URL")
		    // Short means only a single line of text
			.setStyle(discord.TextInputStyle.Short)
			.setRequired(true);
		
		let rowUrl = new discord.ActionRowBuilder().addComponents(inputUrl);
		modal.addComponents(rowUrl);
		
		await interaction.showModal(modal);
		return;
	}
	
	if(interaction.customId.startsWith("playlist_remover_musica")){
		await interaction.reply("Ainda não fiz");
	}
	
	if(interaction.customId.startsWith("playlist_remover_playlist")){
		await interaction.reply("Ainda não fiz");
	}
	
}

module.exports = {
	on,
};