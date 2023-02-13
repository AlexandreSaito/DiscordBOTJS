const { SlashCommandBuilder, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const playlistHandler = require('./../playlistHandler.js');
const { countFieldInEmbed } = require('./../discordConfig.js');

// https://discordjs.guide/popular-topics/embeds.html#using-the-embed-constructor

module.exports = {
	data: new SlashCommandBuilder()
		.setName('playlist')
		.setDescription('Comandos de lista de musica.')
		.addSubcommand(subcommand => subcommand
			.setName('create')
			.setDescription('Criar uma playlist')
			.addStringOption(option => option
				.setName('nome')
				.setDescription('O nome.')
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('info')
			.setDescription('Busca informação da playlist')
			.addStringOption(option => option
				.setName('nome')
				.setDescription('O nome.')
				.setRequired(true)
				.setAutocomplete(true)))
		.addSubcommand(subcommand => subcommand
			.setName('play')
			.setDescription('Toca a muzica')
			.addStringOption(option => option
				.setName('nome')
				.setDescription('O nome.')
				.setRequired(true)
				.setAutocomplete(true)))
		.addSubcommand(subcommand => subcommand
			.setName('teste')
			.setDescription('Busca informação da playlist'))
	,
	async autocomplete(interaction) {
		const focused = interaction.options.getFocused(true);
		console.log("focused subcommand:", interaction.options.getSubcommand());

		let list = playlistHandler.getPlaylistNames();
		let filtered = list.filter(choice => choice.startsWith(focused.value));
		await interaction.respond(filtered.map(x => ({ name: x, value: x })));

	},
	async execute(interaction) {
		//await interaction.deferReply();
		console.log("execute subcommand: ", interaction.options.getSubcommand());

		let subCommandName = interaction.options.getSubcommand();

		if (subCommandName == "create") {

		}
		else if (subCommandName == "create") {
			let playlistName = interaction.options.getString('nome').trim();
			if (playlistName.length > 50) {
				await interaction.reply("O nome pode ter no MAXIMO 50 caracteres.");
				return;
			}
			if (playlistName.includes("/") || playlistName.includes("\\")) {
				await interaction.reply("Sem barrinha no nome fazendo favor...");
				return;
			}
			let info = playlistHandler.createPlaylist(playlistName);
			if (info != null) {
				await interaction.reply(`A Playlist ${info.id} - ${info.name} foi criado seu merda. Agora usa o /playlist info ai se não foi inutil criar...`);
				return;
			}
			await interaction.reply("Se fodeu, não deu para criar HAHAHAHA!");
			return;
		}
		else if (subCommandName == "info") {
			let playlistName = interaction.options.getString('nome').trim();
			let playListInfo = playlistHandler.getPlaylistInfo(playlistName);
			let pInfo = playlistHandler.getInfo().find(x => x.name == playlistName);
			if (playListInfo == null || pInfo == null) {
				await interaction.reply("Esse aí só faltou criar para ter. Ou deu um problema, vai saber tlg? Mas vê se está criado mesmo. Qualquer coisa chama eu (O Saito, não o BOT).");
				return;
			}

			let rowWithPlaylistButtons = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`playlist_adicionar_musica${pInfo.id}`)
						.setLabel('Adicionar musica!')
						.setStyle(ButtonStyle.Primary),
					new ButtonBuilder()
						.setCustomId(`playlist_remover_musica${pInfo.id}`)
						.setLabel('Remover musica!')
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder()
						.setCustomId(`playlist_remover_playlist${pInfo.id}`)
						.setLabel('Deletar playlist!')
						.setStyle(ButtonStyle.Danger),
				);

			let qntEmbed = Math.ceil(playListInfo.data.length / countFieldInEmbed);
			let embeds = [];

			let timeAudioTotal = 0;
			let withoutAudioTimer = 0;
			playListInfo.data.forEach(x => {
				if (!x.duration || x.duration == 0) {
					withoutAudioTimer++;
					return;
				}
				timeAudioTotal += x.duration;
			});

			for (let i = 0; i < qntEmbed; i++) {
				let videoListEmbed = new EmbedBuilder()
					.setColor(0x0099FF)
					.setTitle(pInfo.name)
					.setDescription(`Esta playlist tem ${playListInfo.data.length} itens e um tanto ai de tempo saca, n sei fazer conta tlg. (Mentira é ${timeAudioTotal} segundos e ${withoutAudioTimer} não tem informação do tempo)`)
					.setTimestamp()
					.setFooter({ text: `pag. ${i + 1} de ${qntEmbed}` });

				let min = (i * countFieldInEmbed);
				let total = min + countFieldInEmbed;

				if (total > playListInfo.data.length)
					total = playListInfo.data.length;

				for (let y = min; y < total; y++) {
					let info = playListInfo.data[i];
					videoListEmbed.addFields({ name: `${info.id} - ${info.title}`, value: `url: ${info.url}` });
				}

				embeds.push(videoListEmbed);
			}

			await interaction.reply({ embeds: embeds });
			await interaction.followUp({ ephemeral: true, components: [rowWithPlaylistButtons] });

			return;
		}
		else if (subCommandName == "teste") {
			let videos = [];

			for (let i = 0; i < 55; i++) {
				videos.push({ title: "um titulo", url: "http://youtube.com/watch?v=WGclLoxZz18", id: i });
			}

			let qntEmbed = Math.ceil(videos.length / 25);
			let embeds = [];

			for (let i = 0; i < qntEmbed; i++) {
				let videoListEmbed = new EmbedBuilder()
					.setColor(0x0099FF)
					.setTitle('Nome da playlist')
					.setDescription(`Esta playlist tem ${videos.length} itens e um tanto ai de tempo saca, n sei fazer conta tlg`)
					.setTimestamp()
					.setFooter({ text: `pag. ${i + 1} de ${qntEmbed}` });

				let total = (i * 25) + 25;
				if (total > videos.length)
					total = videos.length;
				for (let y = (i * 25); y < total; y++) {
					videoListEmbed.addFields({ name: `${videos[y].id} - ${videos[y].title}`, value: `url: ${videos[y].url}` });
				}

				embeds.push(videoListEmbed);
			}

			await interaction.reply({ embeds: embeds });
			await interaction.followUp({ ephemeral: true, components: [rowWithPlaylistButtons] });

		}

	},
};