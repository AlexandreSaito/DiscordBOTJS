const { SlashCommandBuilder, ChannelType } = require('discord.js');
const audioHandler = require('./../discordAudioHandler.js');
const ttsHandler = require('./../discordTtsHandler.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('banho')
		.setDescription('Buscar alguem para me dar bainho.')
		.addRoleOption(option => option
				.setName("role")
				.setDescription("Role de candidatos a pegar o sabonete.")
				.setRequired(true))
		,
	async execute(interaction) {
		if (interaction.user.id != interaction.guild.ownerId) {
			await interaction.reply(`Que azar, só o Kelvão tem essa regalia!`);
			return;
		}
		await interaction.reply(`Vamos ver quem vai dar bainho no ${interaction.user} `);
		// busca a role contendo lista de usuarios que podem dar o banho
		let role = interaction.options.getRole('role');
		
		if(role.members.size == 0){
			await interaction.followUp({ content: `Parabens ${interaction.user}! VOCÊ VAI TOMAR BANHO SOZINHO SEU MERDA!` });
			return;
		}
			
		let quemVaiDarBanho = role.members.random();
		console.log("members size: ", role.members.size);
		console.log("id's: ", interaction.user.id, " - ", quemVaiDarBanho.user.id);
		while(interaction.user.id == quemVaiDarBanho.user.id && role.members.size > 1){
			quemVaiDarBanho = role.members.random();
		}
	
		// Manda o resultado
		await interaction.followUp({ content: `Parabens ${quemVaiDarBanho.user}! Você quem vai dar banho hoje!` });
		
		if(interaction.member.voice.channel != null && interaction.member.voice.channel.joinable)
			audioHandler.joinChannel(interaction.member.voice.channel);

		let name = quemVaiDarBanho.nickname;
		if(name == null || name == undefined)
			name = quemVaiDarBanho.user.username;
		ttsHandler.sendTts(`Parabens ${name}! Você quem vai dar banho hoje!`);
		
	},
};