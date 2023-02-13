const dAudio = require('./discordAudio.js');

async function addPlayMusic(interaction){
	console.log("[DISCORD AUDIO HANDLER] options: ", interaction.options);
	
	let url = interaction.options.get("url");
	if(!url || !url.value || url.value == ""){
		await interaction.reply(`Não encontrado, manda um link ai seu merda!`);
	}
	url = url.value;
	await interaction.reply(`Tá na lista para tocar ${url}`);

	if(interaction.member.voice.channel == null || !interaction.member.voice.channel.joinable){
		await interaction.followUp({ content: 'To podendo entrar ai não!', ephemeral: true });
		return;
	}
	joinChannel(interaction.member.voice.channel);
	
	dAudio.addMusicUrl(url);
}

function joinChannel(channel){
	dAudio.joinChannel(channel);
}

function skipMusic(){
	dAudio.skipMusic(skipMusic);
}

function stopMusic(){
	dAudio.deleteAudioPlayer();
}

module.exports = { 
	joinChannel,
	stopMusic,
	addPlayMusic,
	skipMusic
}