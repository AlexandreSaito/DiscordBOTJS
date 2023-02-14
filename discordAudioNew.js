const discordAudio = require('@discordjs/voice');
const fs = require('fs');
const ytdl = require('ytdl-core');
const memoryStream = require('memorystream');
const playlistHandler = require('./playlistHandler.js');
const dc = require('./discordConfig.js');

// const nodeFetch = require('@replit/node-fetch');
// const urlOembed = 'https://www.youtube.com/oembed?format=json&url=';

// https://discordjs.guide/voice/audio-player.html#life-cycle

const states = {
	Idle: 'idle',
	Paused: 'paused',
	Searching: 'searching',
	Playing: 'playing',
	Downloading: 'downloading',
	Buffering: 'buffering'
};

var connection;
var sub;
var player;

var state = 'Not connected yet';

var playlist;
var ytUrls = [];
var resources = [];

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

function changeState(newState){
	if(newState == states.Searching){
		if(state == states.Playing || state == states.Downloading || state == states.Buffering)
			return false;
	}
	state = newState;
	console.log(`DISCORD AUDIO] Player is now ${state}`);
	return true;
}

function joinChannel(channel) {
	console.log("[DISCORD AUDIO] JOINING CHANNEL");
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
			changeState(states.Idle);
			console.log("[DISCORD AUDIO] Played");
			playNextMusic();
		});

		player.on(discordAudio.AudioPlayerStatus.Buffering, () => {
			changeState(states.Buffering);
		});

		player.on(discordAudio.AudioPlayerStatus.Playing, () => {
			changeState(states.Playing);
		});

		player.on(discordAudio.AudioPlayerStatus.AutoPaused, () => {
			changeState(states.Paused);
		});

		player.on(discordAudio.AudioPlayerStatus.Paused, () => {
			changeState(states.Paused);
		});

		player.on('error', error => {
			changeState(states.Idle);
			console.error("[DISCORD AUDIO] PLAYER ERROR: ", error);
		});

	}
}

function deleteAudioPlayer() {
	player.stop();
	resources = [];
	player = undefined;
	getNext = false;
}

function subscribeChannel(connection) {
	sub = connection.subscribe(player);
}

function skipMusic() {
	player.stop();
	playNextMusic();
}

function playAudio(playableResource) {
	player.play(playableResource);
}

function getNextResource(){
	if(resources.length == 0)
		return null;
	return resources.shift();
}

function addToResources({stream, title = "", inlineAudio = null}){
	let audioResource;
	if(inlineAudio != null){
		audioResource = discordAudio.createAudioResource(stream);
	}else{
		audioResource = discordAudio.createAudioResource(stream, { inlineVolume: true });
		audioResource.volume.setVolume(inlineAudio);
	}

	resources.push({ title: title, audio: audioResource });
}

async function playNextMusic(){
	if(!changeState(states.Searching))
		return;
	let r = getNextResource();
	if (r != null) {
		if(r.title && r.title != "")
			sendToMusicChannel(`Tocando ${r.title}`);
		playAudio(r.audio);
		return;
	}
	if(await addNextYTUrlToResourceAndPlay())
		return;

	if(getNextOnPlaylist())
		return;

	changeState(states.Idle);
}

// return true if has something to add
async function addNextYTUrlToResourceAndPlay(){
	if(ytUrls.length == 0)
		return false;
	let ytUrl = ytUrls.shift();
	
	let resource = { title: '', stream: new memoryStream() }

	//let videoInfo = await ytdl.getBasicInfo(ytUrl, { downloadURL: true });
	//resource.title = videoInfo ? videoInfo.player_response.videoDetails.title : ytUrl;
	resource.title = ytUrl;
	
	state = states.Downloading;
	let s = ytdl(url, { filter: 'audioonly', format: 'webm' });
	s.on('info', (info) => {
		resource.title = info.title;
	});
	s.on('error', (e) => {
		changeState(states.Idle);
		sendToMusicChannel(`Deu erro aqui ó! Musica de merda: ${url}`);
		console.error("[DISCORD AUDIO] DOWNLOAD AUDIO ERROR: " + e);
		playNextMusic();
	});
	s.on("end", () => {
		addToResources(resource.stream, resource.title);
		console.log("[DISCORD AUDIO] Audio done download!");
	
		let state = getCurrentState();
		if (state == states.Idle || state == states.Searching || state == states.Paused) {
			playNextMusic();
		}
	});
	s.pipe(stream, { end: false });
	
	return true;
}

function addMusicUrl(url){
	ytUrls.push(url);
	
	if (state == states.Paused || state == states.Idle || state == states.Searching) {
		playNextMusic();
	}
	
}

// return true if has comething to add
function getNextOnPlaylist(){
	if(!playlist)
		return false;
		
	let music;
	while(!music){
		playlist.currentMusicId++;
		
		if(playlist.currentMusicId > playlist.lastId){
			playlist = null;
			return false;
		}
		
		music = playlist.data.find(x => x.id == playlist.currentMusicId);
	}
	
	let pInfo = playlistHandler.getInfo().find(x => x.id == playlist.playlistId);

	let fileName = `${playlistHandler.playlistFolder}/${pInfo.name}/${music.fileName}`;
	
	console.log("[DISCORD AUDIO] PLAYLIST FILENAME", fileName);

	if(!fs.existsSync(fileName)){
		addMusicUrl(music.url);
		return true;
	}

	let	rs = fs.createReadStream(fileName);
	let stream = new memoryStream();
  rs.on("end", () => {
		addToResources({ stream: stream, title: music.title });
		playNextMusic();
	});
	rs.on("error", (err) => {
		changeState(states.Idle);
		sendToMusicChannel(`PUTZ QUE AZAR. Falha ao executar musica ${music.title}...`);
		console.error("[DISCORD AUDIO] FAILED TO READ AUDIO FILE CONTENT: ", err);
	});
	rs.pipe(stream);
	
	return true;
}

module.exports = {
	getCurrentState,
	addToResources,
	joinChannel,
	addMusicUrl,
	skipMusic,
	deleteAudioPlayer,
	playNextMusic,
}