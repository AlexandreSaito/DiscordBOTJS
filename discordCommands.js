const fs = require('node:fs');
const path = require('node:path');

function registerCommands(commandsCollection) {
	var commands = [];
	const commandsPath = path.join(__dirname, 'discordCommands');
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			console.log(`Registering command ${command.data.name}`);
			commandsCollection.set(command.data.name, command);
			commands.push(command.data.toJSON());
			//console.log(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
	
	return commands;
}

module.exports = { registerCommands };