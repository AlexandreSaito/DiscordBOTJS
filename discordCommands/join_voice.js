const { SlashCommandBuilder, ChannelType } = require('discord.js');
const audioHandler = require('./../discordAudioHandler.js');
// another way to do music
// https://v12.discordjs.guide/voice/optimisation-and-troubleshooting.html#using-ogg-webm-opus-streams

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
		.setName('join')
		.setDescription('Manda entrar!')
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('The channel to echo into')
				.addChannelTypes(ChannelType.GuildVoice)
				.setRequired(true)),
	async execute(interaction) {
		await interaction.reply(`Entrando em ${interaction.user}...`);
		console.log("member", interaction.member);
		console.log("voice", interaction.member.voice);
		console.log("voice channel", interaction.member.voice.channel);
		await interaction.followUp({ content: 'Aqui já entro!', ephemeral: true });
	},
};