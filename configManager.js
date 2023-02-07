const fs = require('fs');

const ttsConfigFile = 'config/ttsConfig.json';

var currentTtsConfig = readFromFile(ttsConfigFile);

function getTtsData(){
	return Object.assign({}, currentTtsConfig);
}

function changeTTSConfig({ lenguage, welcomeMessage }){
	if(lenguage)
		currentTtsConfig.lenguage = lenguage;
	if(welcomeMessage)
		currentTtsConfig.welcomeMessage = welcomeMessage;
	
	let data = JSON.stringify(currentTtsConfig, null, 2);
	writteToFile(data, ttsConfigFile);
}

function readFromFile(file){
	if(!fs.existsSync(file))
		return {};
	return JSON.parse(fs.readFileSync(file))
}

function writteToFile(data, file){
	fs.writeFileSync(file, data);
}

module.exports = {
	changeTTSConfig,
	getTtsData,
}