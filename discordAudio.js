const discordAudio = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const memoryStream = require('memorystream');
const nodeFetch = require('@replit/node-fetch');

const urlOembed = 'https://www.youtube.com/oembed?format=json&url=';

// https://discordjs.guide/voice/audio-player.html#life-cycle

var connection;
var sub;
var player;
var urls = [];
var resources = [];
var getNext = false;
var state;
var join;
var musicChatChannel;

function setMusicChatChannel(channel){
	musicChatChannel = channel;
}

function getState() {
	return state;
}

function addMusicUrl(url) {
	let o = { url: url };

	// busca titulo do video
	try {
		nodeFetch(urlOembed + url).then(response => {
			return response.json();
		}).then(r => {
			o.title = r.title;
		}).catch(error => {
			console.error('There was an error!', error);
		});
	} catch (e) {
		console.error('There was an error! [nodeFetch]', error);
	}
	
	urls.push(o);
	if (state != 'playing' && state != 'downloading') {
		getNextMusic();
	}
}

function sendToMusicChannel(text){
	if(musicChatChannel && musicChatChannel != null)
	musicChatChannel.send(text);
}

function getNextMusic() {
	if (urls.length == 0)
		return;
	console.log("getting next music");
	state = 'downloading';
	let m = urls.shift();
	let url = m.url;

	if(m.title)
			sendToMusicChannel(`Tocando uma... musica ${m.title}`);
	else
			sendToMusicChannel(`Tocando uma... musica ${m.url}`);
		
	//m.channel.send(`Tocando uma... musica ${url}`);
	let s = ytdl(url, { filter: 'audioonly', format: 'webm' });
	let stream = new memoryStream();
	s.pipe(stream, { end: false });
	s.on('error', (e) => {
		state = 'idle';
		m.channel.send(`Deu erro aqui ó! Musica de merda: ${url}`);
		console.error("[ERROR] " + e);
	});
	s.on("end", () => {
		console.log("audio done download!")
		let state = getCurrentState();
		addToResources(stream);
		if (state != 'playing') {
			playOnList();
		}
	});
}

function getNextQueue() {
	if (resources.length == 0)
		return null;
	return resources.shift();
}

function addToResources(stream, inlineAudio = null) {
	if(inlineAudio == null){
		resources.push(discordAudio.createAudioResource(stream));
		return;
	}

	let audioResource = discordAudio.createAudioResource(stream, { inlineVolume: true });
	audioResource.volume.setVolume(inlineAudio);
	resources.push(audioResource);
}

function joinChannel(channel) {
	console.log("join channel");
	connection = discordAudio.joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guildId,
		adapterCreator: channel.guild.voiceAdapterCreator,
	});
	createAudioPlayer();
	subscribeChannel(connection);
}

function removeFromChannel(channel) {
	if (sub)
		sub.unsubscribe();
	if (connection)
		connection.destroy();
}

function createAudioPlayer() {
	if (!player) {
		player = discordAudio.createAudioPlayer({
			behaviors: {
				//noSubscriber: discordAudio.NoSubscriberBehavior.Pause,
			},
		});

		player.on(discordAudio.AudioPlayerStatus.Idle, () => {
			console.log("Idleing");
			state = 'idle';
			if (getNext) {
				console.log('Get next music!');
				playOnList();
				//getNextMusic();
			}
		});

		player.on(discordAudio.AudioPlayerStatus.Buffering, () => {
			state = 'buffering';
			console.log('Buffering music!');
		});

		player.on(discordAudio.AudioPlayerStatus.Playing, () => {
			state = 'playing';
			console.log('Playing music!');
		});

		player.on(discordAudio.AudioPlayerStatus.AutoPaused, () => {
			state = 'paused';
			console.log('Music was auto paused!');
		});

		player.on(discordAudio.AudioPlayerStatus.Paused, () => {
			state = 'paused';
			console.log('Music was paused!');
		});

		player.on('error', error => {
			state = 'idle';
			console.error("Player error: ", error);
		});

	}
}

function playAudio(playableResource) {
	player.play(playableResource);
}

function playOnList() {
	let r = getNextQueue();
	if (r == null) {
		getNext = false;
		getNextMusic();
		return;
	}
	playAudio(r);
	getNext = true;
}

function deleteAudioPlayer() {
	player.stop();
	resources = [];
	player = undefined;
	getNext = false;
}

function skipMusic() {
	player.stop();
	getNext = true;
	getNextMusic();
}

function subscribeChannel(connection) {
	sub = connection.subscribe(player);
}

function getCurrentState() {
	return state;
}

module.exports = {
	getCurrentState,
	addToResources,
	playOnList,
	joinChannel,
	removeFromChannel,
	deleteAudioPlayer,
	getNextMusic,
	addMusicUrl,
	skipMusic,
	getState,
	setMusicChatChannel
}