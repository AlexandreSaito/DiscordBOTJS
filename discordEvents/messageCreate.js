
function onMessageCreate(message){
		console.log(`[DISCORD MESSAGE] ${message.member.user.username}: ${message.content}`);
}

module.exports = {
	onMessageCreate
};