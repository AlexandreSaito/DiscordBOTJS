const { SlashCommandBuilder, ChannelType } = require('discord.js');
const punishmentManager = require('./../punishmentManager.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('castigo')
		.setDescription('Coloca de castigo')
		.addUserOption(option =>
			option.setName("user")
				.setDescription("O corno")
				.setRequired(true))
		.addChannelOption(option =>
			option.setName("channel")
				.setDescription("Onde vai ficar prezinho")
				.addChannelTypes(ChannelType.GuildVoice)
				.setRequired(true))
		.addNumberOption(option =>
			option.setName("minutos")
				.setDescription("Minutos"))
		.addNumberOption(option =>
			option.setName("segundos")
				.setDescription("Segundos"))
		/*.addBooleanOption(option =>
			option.setName("hate")
				.setDescription("Manda xingão no privado"))*/,
	async execute(interaction) {
		//console.log(interaction.options)
		await interaction.reply(`Kelvão é um GOSTOSO`);
		if (interaction.user.id != interaction.guild.ownerId) {
			await interaction.editReply(`Tu não pode otario HAHAHAHAHAHA!`);
			return;
		}
		//return;
		let user = interaction.options.getUser('user');
		let minutos = interaction.options.getNumber('minutos');
		let segundos = interaction.options.getNumber('segundos');
		let channel = interaction.options.getChannel('channel');
		let hate = 'true';//interaction.options.getBooleanOption("hate");

		console.log(user);

		if (!segundos)
			segundos = 0;
		if (minutos)
			segundos += minutos * 60;

		if (segundos == 0) {
			await interaction.followUp({ content: 'Ele nem vai ficar tempo algum... PORRA', ephemeral: true });
			return;
		}

		let ms = segundos * 1000;
		punishmentManager.addPunishment(user.id, ms, punishmentManager.PunishmentType.salaDoCastigo, { channel: channel.id, delete: false });
		interaction.guild.members.fetch(user.id).then(member => {
			if (!member) return;
			console.log(member);
			member.voice.setChannel(channel);
			if (hate == 'true') {
				let index = 0;
				var timer = setInterval(() => {
					if (punishmentManager.xingos.length >= index) {
						clearInterval(timer);
						return;
					}
					user.send(punishmentManager.xingos[index]);
					index++;
				}, ms / punishmentManager.xingos.length);
			}

		});


	},
};