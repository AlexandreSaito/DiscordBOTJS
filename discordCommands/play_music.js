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
		.setName('play')
		.setDescription('Musiginha')
		.addStringOption(option => 
			option.setName("url")
				.setDescription("YouTube URL")
				.setRequired(true)),
	async execute(interaction) {
		audioHandler.addPlayMusic(interaction);
	},
};