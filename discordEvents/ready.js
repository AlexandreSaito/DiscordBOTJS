const dClient = require("./../discordClient.js");
const dConfig = require("./../discordConfig.js");

const MUSIC_CHANNEL_ID = process.env['MUSIC_CHANNEL_ID'];
const TEXT_CHANNEL_ID = process.env['TEXT_CHANNEL_ID'];

function onReady() {
	let client = dClient.getClient();
	
	client.user.setUsername("Minguelvão");
	
	dConfig.botOn = true;
	console.log(`Logged in as ${client.user.tag}!`);
	
	let Guilds = client.guilds.cache;
	
	if (MUSIC_CHANNEL_ID != '1' || MUSIC_CHANNEL_ID != 1){
		client.channels.fetch(MUSIC_CHANNEL_ID).then(channel => dConfig.channels.setMusicChatChannel(channel));
	}
	if (TEXT_CHANNEL_ID != '1' || TEXT_CHANNEL_ID != 1){
		client.channels.fetch(TEXT_CHANNEL_ID).then(channel => dConfig.channels.setMainChatChannel(channel));
	}
	
	Guilds.forEach(guild => {
		console.log("Guild: ", guild.id);
		console.log("members");
		guild.members.cache.forEach(member => {
			//if (member.user.username.includes("Minguelvão"))
			//	return;
			console.log(member.user.username);
			//member.send("Mais uma para ver se arrumei");
		});
		
	});
	
}

module.exports = {
	onReady
};