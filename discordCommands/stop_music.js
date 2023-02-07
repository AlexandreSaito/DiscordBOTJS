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
		.setName('stop')
		.setDescription('Para saporra'),
	async execute(interaction) {
		await interaction.reply(`Otario`);
		audioHandler.stopMusic();
	},
};