const discordClient = require("./../discordClient.js");
const discordTtsHandler = require('./../discordTtsHandler.js');
const audioHandler = require('./../discordAudioHandler.js');
const pm = require('./../punishmentManager.js');
const dConfig = require('./../discordConfig.js');

const MINGUEL_ID = process.env['MINGUEL_ID'];
const MAGNUM_ID = process.env['MAGNUM_ID'];

function onVoiceStateUpdate(oldState, newState) {
	console.log("[VoiceStateUpdade]");
	console.log(newState.member.user);

	if (newState.channelID === null) return;
	if (oldState.channelID != null && newState.channelID != null) return;

	if(!newState.channel) return;

	let userId = newState.member.user.id;
	let client = discordClient.getClient();

	if (newState.id === client.user.id && newState.serverMute)
		newState.setMute(false);

	let up = pm.getPunishments(pm.PunishmentType.salaDoCastigo, userId);
	if (up != null) {
		if(up.params.channel == newState.channel.id)
			return;
		console.log("[PUNISH]");
		console.log(up);
		newState.guild.members.fetch(up.user).then((user) => {
			if (!user) return;
			newState.guild.channels.fetch(up.params.channel).then(c => {
				if (!c) return;
				user.voice.setChannel(c);
				user.send("VOLTA LÁ SEU MERDA!");
			});
		});
	}

	if (userId == MINGUEL_ID) {
		//audioHandler.joinChannel(newState.channel);
	}

	let isJoinable = newState.channel.joinable;
	if (dConfig.encherOSaco && isJoinable) {

		if (userId == MINGUEL_ID) {
			audioHandler.joinChannel(newState.channel);
			discordTtsHandler.sendHelpMessage();
		}

		if (userId == MAGNUM_ID) {
			audioHandler.joinChannel(newState.channel);
			discordTtsHandler.sendTts('ALGUEM MANDA UMA FOFOCA AI?');
		}

	}

}

module.exports = {
	onVoiceStateUpdate
};