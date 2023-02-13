const fs = require('fs');
const ytdl = require('ytdl-core');

const playlistFolder = "./playlist";
const infoFile = "info.json";

function getPlaylistNames() {
	let files = fs.readdirSync(playlistFolder, { withFileTypes: true });
	//files.forEach(file => { console.log(file, file.isDirectory()); });
	return files.filter(x => x.isDirectory()).map(x => x.name);
}

function getInfo() {
	return JSON.parse(fs.readFileSync(`${playlistFolder}/${infoFile}`));
}

function getInfoById(id){
	return getInfo().data.find(x => x.id == id)
}

function getPlaylistInfo(playlistName) {
	let fileName = `${playlistFolder}/${playlistName}/${infoFile}`;
	if (!fs.existsSync(fileName))
		return null;
	let info = JSON.parse(fs.readFileSync(fileName));
	info.files = getFilesOnPlaylist(playlistName);
	return info;
}

function getFilesOnPlaylist(playlistName) {
	let files = fs.readdirSync(`${playlistFolder}/${playlistName}`, { withFileTypes: true });
	//files.forEach(file => { console.log(file); });
	return files.filter(x => !x.name.includes(infoFile)).map(x => x.name);
}

function createPlaylist(playlistName) {
	let folderName = `${playlistFolder}/${playlistName}`;
	let playlistInfoFileName = `${playlistFolder}/${playlist}/${infoFile}`;

	if (fs.existsSync(folderName))
		return null;

	let infos = getInfo();
	let info = { id: infos.lastId + 1, name: playlistName };

	infos.data.push(info);
	infos.lastId += 1;

	fs.mkdirSync(folderName, { recursive: true });

	fs.writeFileSync(`${playlistFolder}/${infoFile}`, JSON.stringify(infos), { encoding: 'utf8', flag: 'w' });
	fs.writeFileSync(playlistInfoFileName, JSON.stringify({ lastId: 0, playlistId: info.id, data: [] }), { encoding: 'utf8', flag: 'w' });

	return info;
}

function deletePlaylist(playlist) {
	let infos = getInfo();
	let info = infos.data.find(x => x.name == playlist);
	infos.data.splice(infos.data.indexOf(info), 1);

	fs.rmSync(`${playlistFolder}/${playlist}`, { recursive: true, force: true });

	fs.writeFileSync(`${playlistFolder}/${infoFile}`, JSON.stringify(infos), { encoding: 'utf8', flag: 'w' });
}

function removeMusic(playlist, musicId) {
	let playlistInfoFileName = `${playlistFolder}/${playlist}/${infoFile}`;
	let playlistInfo = getPlaylistInfo(playlist);

	if (playlistInfo == null || playlistInfo.data.length == 0) {
		return;
	}

	let videoInfo = playlistInfo.data.find(x => x.id == musicId);
	let videoFileName = playlistInfo.files.find(x => x.includes(videoInfo.id));
	if (videoFileName) {
		fs.unlinkSync(`${playlistFolder}/${playlist}/${videoFileName}`);
	}
	if (!videoInfo) {
		return;
	}
	playlistInfo.data.splice(playlistInfo.data.indexOf(videoInfo), 1);
	fs.writeFileSync(playlistInfoFileName, JSON.stringify(playlistInfo), { encoding: 'utf8', flag: 'w' });
}

async function addMusicToPlaylist(url, playlistId, download = true) {
	let pInfo = getInfoById(playlistId);
	let playlistInfoFileName = `${playlistFolder}/${pInfo.name}/${infoFile}`;

	let playlistInfo = getPlaylistInfo(playlist);
	if (playlistInfo == null){
		playlistInfo = { lastId: 0, data: [] };
	}

	if (playlistInfo.data.length > 0) {
		if(playlistInfo.data.filter(x => x.url == url).length > 0){
			return false;
		}
	}

	let videoInfo = await ytdl.getBasicInfo(url, { downloadURL: true });
	if(!videoInfo){
		return false;
	}
	//fs.writeFileSync('videoinfo.json', JSON.stringify(videoInfo, null, "\t"), {encoding:'utf8',flag:'w'})

	let currentId = playlistInfo.lastId + 1;
	let audioInfo = {
		id: currentId,
		fileName: `${currentId}.webm`,
		url: url,
		title: videoInfo ? videoInfo.player_response.videoDetails.title : '',
		duration: videoInfo ? videoInfo.player_response.videoDetails.lengthSeconds : 0
	};

	playlistInfo.data.push(audioInfo);

	playlistInfo.lastId += 1;
	fs.writeFileSync(playlistInfoFileName, JSON.stringify(playlistInfo), { encoding: 'utf8', flag: 'w' })

	if (download) {
		let filePath = `${playlistFolder}/${pInfo.name}/${audioInfo.fileName}`;
		if (fs.existsSync(filePath)) {
			console.error("[PLAYLIST HANDLER] Already have a file downloaded");
			return false;
		}
		let s = ytdl(url, { filter: 'audioonly', format: 'webm' });
		s.pipe(fs.createWriteStream(filePath), { end: false });
		console.log("started!");
		s.on("end", () => {
			console.log("video downloaded!");
		});
		s.on('error', (err) => {
			console.error(err);
			fs.unlink(filePath);
		});
	}

	return true;
}

module.exports = {
	getPlaylistNames,
	getFilesOnPlaylist,
	createPlaylist,
	addMusicToPlaylist,
	getPlaylistInfo,
	deletePlaylist,
	removeMusic,
	getInfo,
	getInfoById,
	playlistFolder,
};