const discordAudio = require('./discordAudio.js');
const gTTS = require('gtts');
// https://www.npmjs.com/package/gtts

var welcomeMessage = null;
var helpMessage = "Socorro, não sou um bot, estou sendo ameaçado para tocar música para vocês!";

const defaultLen = 'pt';//'ko';

var currentLen = defaultLen;

function sendTts(text) {
	// create stream
	var gtts = new gTTS(text, currentLen);
  discordAudio.addToResources(gtts.stream(), 3);
	discordAudio.playOnList();
}

function sendHelpMessage() {
	console.log("sending help message");
	sendTts(helpMessage);
}

module.exports = {
	sendTts,
	sendHelpMessage,
}
