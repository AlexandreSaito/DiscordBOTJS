const dClient = require('./discordClient.js');

const PunishmentType = {
	salaDoCastigo: 'salaDoCastigo',
};

var usersToBePunished = [];

var xingos = [
	"TOMO CASTIGO OTARIO!",
	"HAHAHAHAHA",
	"SE FODEU",
];

function addPunishment(userId, time, type, params) {
	usersToBePunished.push({
		user: userId,
		time: time,
		type: type,
		start: Date.now(),
		params: params
	});
	console.log("[PUNISHMENT MANAGER] User to be punished list: ", usersToBePunished);
}

function getPunishments(type, userId = null) {
	let punishments = usersToBePunished.filter(x => x.type == type);
	if (userId == null)
		return punishments;
	let up = punishments.find(x => x.user == userId);
	if (up != null) {
		if (removeFromPunishment(up))
			return null;
	}
	return up;
}

function removeFromPunishment(up) {
	if (Date.now() >= up.start + up.time) {
		let index = usersToBePunished.indexOf(up);
		console.log("[PUNISHMENT MANAGER] RemoveFromPunishment Index: ", index);
		if(index != -1){
			delete usersToBePunished[index];
			return true;
		}
	}
	return false;
}

module.exports = {
	PunishmentType,
	addPunishment,
	getPunishments,
	xingos
};