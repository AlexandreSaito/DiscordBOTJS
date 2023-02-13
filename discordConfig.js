const countFieldInEmbed = 25;

var encherOSaco = false;
var botOn = false;

var mainChatChannel;
var musicChatChannel;

function setMainChatChannel(channel){
	mainChatChannel = channel;
}
function setMusicChatChannel(channel){
	musicChatChannel = channel;
}

function getMainChatChannel(){
	return mainChatChannel;
}
function getMusicChatChannel(){
	return musicChatChannel;
}

module.exports = {
	encherOSaco,
	botOn,
	countFieldInEmbed,
	channels: {
		getMainChatChannel,
		setMainChatChannel,
		getMusicChatChannel,
		setMusicChatChannel,
	}
};