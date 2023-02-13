const dAudio = require('./discordAudio.js');
const gTTS = require('gtts');
// https://www.npmjs.com/package/gtts

var helpMessage = "Socorro, não sou um bot, estou sendo ameaçado para tocar música para vocês!";

const defaultLen = 'pt';//'ko';

var currentLen = defaultLen;

function sendTts(text) {
	// create stream
	var gtts = new gTTS(text, currentLen);
  dAudio.addToResources(gtts.stream(), 5);
	dAudio.playOnList();
}

function sendHelpMessage() {
	sendTts(helpMessage);
}

module.exports = {
	sendTts,
	sendHelpMessage,
}
