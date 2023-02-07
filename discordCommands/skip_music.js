const { SlashCommandBuilder, ChannelType } = require('discord.js');
const audioHandler = require('./../discordAudioHandler.js');

//console.log("play");
//await interaction.deferReply("Adding music");
//audioHandler.joinChannel(interaction.member.voice.channel);
//await interaction.editReply('Music Added!');
//audioHandler.addMusic(interaction.command);
//console.log("stop")
//audioHandler.removeFromChannel(interaction.member.voice.channel);
//audioHandler.removeFromChannel(interaction.channel);
//audioHandler.addMusic(interaction.command);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Pula saporra'),
	async execute(interaction) {
		await interaction.reply(`Essa musica é ruim mesmo...`);
		audioHandler.skipMusic();
	},
};