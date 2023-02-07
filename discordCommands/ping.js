const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Manda o pong!'),
	async execute(interaction) {
		let dt1 = interaction.createdAt;
		let dt2 = Date.now();
		var dif = dt1.getTime() - dt2;

		dif = Math.abs(dif);
		
		await interaction.reply(`Pinga na casa do krl! Demorei ${dif}ms para ver.`);
	},
};