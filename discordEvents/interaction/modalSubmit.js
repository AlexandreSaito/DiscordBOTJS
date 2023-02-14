const playlistHandler = require('./../../playlistHandler.js');

// https://discordjs.guide/interactions/modals.html#responding-to-modal-submissions

async function on(interaction) {
	await interaction.deferUpdate();
	console.log("[INTERACTION MODAL SUBMIT] CustomId: ", interaction.customId);

	if(interaction.customId.startsWith("mdl_playlist_add_musica")){
		let id = interaction.customId.replace("mdl_playlist_add_musica", "");
		let url = interaction.fields.getTextInputValue('inputUrl');
		console.log("[MODAL mdl_playlist_add_musica] URL: ", url);
		
		await interaction.reply("Adicionando a musica...");
		
		if(!await playlistHandler.addMusicToPlaylist(url, id)){
			await interaction.editReply("Falha em adicionar...");
		}
	}
	
}

module.exports = {
	on
};