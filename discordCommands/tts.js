const { SlashCommandBuilder, ChannelType } = require('discord.js');
const audioHandler = require('./../discordAudioHandler.js');
const ttsHandler = require('./../discordTtsHandler.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fala')
		.setDescription('TTS só que sim')
		.addStringOption(option =>
			option.setName("message")
				.setDescription("Manda poema pro Kelvão")
				.setRequired(true)),
	async execute(interaction) {
		await interaction.reply("Falo!");	
		if (interaction.member.voice.channel == null || !interaction.member.voice.channel.joinable) {
			await interaction.followUp({ content: 'Ce num tá na chamada, corno!', ephemeral: true });
		}
		let tts = interaction.options.get("message");
		if (!tts || !tts.value || tts.value == "") {
			await interaction.reply(`Manda uma fra-fra-fra-frase!`);
		}
		tts = tts.value;
		if(interaction.member.voice.channel != null && interaction.member.voice.channel.joinable)
		audioHandler.joinChannel(interaction.member.voice.channel);
		ttsHandler.sendTts(tts);
	},
};