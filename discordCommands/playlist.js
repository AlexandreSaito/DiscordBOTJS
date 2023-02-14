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
	,
	async autocomplete(interaction) {
		const focused = interaction.options.getFocused(true);
		console.log("focused subcommand:", interaction.options.getSubcommand());

		let list = playlistHandler.getPlaylistNames();
		//let filtered = list.filter(choice => choice.startsWith(focused.value));
		await interaction.respond(list.map(x => ({ name: x, value: x })));

	},
	async execute(interaction) {
		//await interaction.deferReply();
		let subCommandName = interaction.options.getSubcommand();
		console.log("[PLAYLIST] Execute Subcommand: ", subCommandName);

		if (subCommandName == "play") {
			let playlistName = interaction.options.getString('nome').trim();
			let playlistInfo = playlistHandler.getPlaylistInfo(playlistName);
			let pInfo = playlistHandler.getInfoById(playlistInfo.playlistId);
			if (playlistInfo == null || pInfo == null) {
				console.error("[PLAYLIST_PLAY] playlistInfo", playlistInfo);
				console.error("[PLAYLIST_PLAY] pInfo", pInfo);
				await interaction.reply("Esse aí só faltou criar para ter. Ou deu um problema, vai saber tlg? Mas vê se está criado mesmo. Qualquer coisa chama eu (O Saito, não o BOT).");
				return;
			}
			await interaction.reply(`Playlist ${pInfo.id} - ${pInfo.name} // Tem ${playlistInfo.data.length} musicas...`);
			// dAudio.addPlaylist(playlistInfo);
			return;
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
			if (info == null) {
				await interaction.reply("Se fodeu, não deu para criar HAHAHAHA!");
				return;
			}
			await interaction.reply(`A Playlist ${info.id} - ${info.name} foi criada seu merda. Agora usa o /playlist info ai se não foi inutil criar...`);
			return;
		}
		else if (subCommandName == "info") {
			let playlistName = interaction.options.getString('nome').trim();
			
			let playlistInfo = playlistHandler.getPlaylistInfo(playlistName);
			let pInfo = playlistHandler.getInfoById(playlistInfo.playlistId);
			
			console.error("[PLAYLIST_PLAY] playlistInfo", playlistInfo);
			console.error("[PLAYLIST_PLAY] pInfo", pInfo);

			if (playlistInfo == null || pInfo == null) {
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

			var embeds = playlistHandler.generatePlaylistEmbed(pInfo, playlistInfo);

			if(embeds.length == 0){
				await interaction.reply(`Nenhuma musica encontrada na Playlist ${pInfo.name}`);
			}else{
				await interaction.reply({ embeds: embeds });
			}
			await interaction.followUp({ ephemeral: true, components: [rowWithPlaylistButtons] });
			return;
		}

	},
};