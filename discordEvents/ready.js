const discordClient = require("./../discordClient.js");
const discordAudio = require("./../discordAudio.js");
const dConfig = require("./../discordConfig.js");

const MUSIC_CHANNEL_ID = process.env['MUSIC_CHANNEL_ID'];

function onReady() {
	let client = discordClient.getClient();
	client.user.setUsername("Friboi2");
	console.log(`Logged in as ${client.user.tag}!`);
	dConfig.botOn = true;
	let Guilds = client.guilds.cache;
	if (MUSIC_CHANNEL_ID != '1' || MUSIC_CHANNEL_ID != 1){
		client.channels.fetch(MUSIC_CHANNEL_ID).then(channel => discordAudio.setMusicChatChannel(channel));
	}
	Guilds.forEach(guild => {
		console.log("Guild: ", guild.id);
		console.log("members");
		guild.members.cache.forEach(member => {
			if (member.user.username.includes("Friboi2"))
				return;
			console.log(member.user.username);
			//member.send("Mais uma para ver se arrumei");
		});
});
}

module.exports = {
	onReady
};