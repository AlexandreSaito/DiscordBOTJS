const discordAudio = require('./discordAudio.js');

async function addPlayMusic(interaction){
	console.log("ADICIONANDO MUSICA")
	console.log(interaction.options)
	let url = interaction.options.get("url");
	if(!url || !url.value || url.value == ""){
		await interaction.reply(`Não encontrado, manda um link ai seu merda!`);
	}
	url = url.value;
	await interaction.reply(`Metendo musiguinha ${url}...`);

	if(interaction.member.voice.channel == null || !interaction.member.voice.channel.joinable){
		await interaction.followUp({ content: 'To podendo entrar ai não!', ephemeral: true });
		return;
	}
	joinChannel(interaction.member.voice.channel);
	
	discordAudio.addMusicUrl(url);
	await interaction.followUp({ content: 'Chxabum!', ephemeral: true });
}

function joinChannel(channel){
	discordAudio.joinChannel(channel);
}

function skipMusic(){
	discordAudio.skipMusic(skipMusic);
}

function removeFromChannel(channel){
	
}

function stopMusic(){
	discordAudio.deleteAudioPlayer();
}

module.exports = { 
	joinChannel,
	removeFromChannel,
	stopMusic,
	addPlayMusic,
	skipMusic
}