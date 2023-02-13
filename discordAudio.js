const discordAudio = require('@discordjs/voice');
const fs = require('fs');
const ytdl = require('ytdl-core');
const memoryStream = require('memorystream');
const nodeFetch = require('@replit/node-fetch');
const playlistHandler = require('./playlistHandler.js');
const dc = require('./discordConfig.js');

const urlOembed = 'https://www.youtube.com/oembed?format=json&url=';

// https://discordjs.guide/voice/audio-player.html#life-cycle

var connection;
var sub;
var player;

var urls = [];
var resources = [];

var state;
var getNext = false;

var playlist;

function sendToMusicChannel(text){
	let musicChatChannel = dc.channels.getMusicChatChannel();
	if(!musicChatChannel){
		console.error("[DISCORD AUDIO] Can't send message to music channel!")
		return;
	}
	musicChatChannel.send(text);
}

function getCurrentState() {
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

function getNextMusic() {
	if (urls.length == 0){
		getNextOnPlaylist();
		return;
	}
	console.log("getting next music");
	state = 'downloading';
	let m = urls.shift();
	let url = m.url;
		
	let s = ytdl(url, { filter: 'audioonly', format: 'webm' });
	let stream = new memoryStream();
	s.pipe(stream, { end: false });
	s.on('error', (e) => {
		state = 'idle';
		sendToMusicChannel(`Deu erro aqui ó! Musica de merda: ${url}`);
		console.error("[ERROR] " + e);
	});
	s.on("end", () => {
		console.log("audio done download!")
	
		if(m.title)
				sendToMusicChannel(`Tocando uma... musica ${m.title}`);
		else
				sendToMusicChannel(`Tocando uma... musica ${m.url}`);
		
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

function getNextOnPlaylist(){
	if(!playlist)
		return;
	
	if(playlist.currentMusicId >= playlist.lastId){
		playlist = null;
		return;
	}
	
	let music;
	while(!music){
		playlist.currentMusicId++;
		
		if(playlist.currentMusicId > playlist.lastId){
			playlist = null;
			return;
		}
		
		music = playlist.data.find(x => x.id == playlist.currentMusicId);
	}

	let pInfo = playlistHandler.getInfo().find(x => x.id == playlist.playlistId);;

	let fileName = `${playlistHandler.playlistFolder}/${pInfo.name}/${music.fileName}`;
	
	console.log("{FILENAME}", fileName);
	
	if(!fs.existsSync(fileName)){
		addMusicUrl(music.url);
		return;
	}
	
	let	rs = fs.createReadStream(fileName);
	let stream = new memoryStream();
  rs.on("end", () => {
		sendToMusicChannel(`Tocando uma... musica ${music.title}`);
		addToResources(stream);
		if (state != 'playing') {
			playOnList();
		}
	});
	rs.pipe(stream);
	
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

module.exports = {
	getCurrentState,
	addToResources,
	playOnList,
	joinChannel,
	deleteAudioPlayer,
	getNextMusic,
	addMusicUrl,
	skipMusic,
}