const http = require('http');
const url = require('url');
const fs = require('fs');
const ytdl = require('ytdl-core');
const discord = require('./discordHandler.js');
const discordAudio = require("./discordAudio.js");
const dConfig = require("./discordConfig.js");

const { exec } = require("child_process");

// https://stackoverflow.com/questions/64094105/get-youtube-video-title-without-api-key

//exec("kill 1");

// https://app.koyeb.com/auth/signin?next=%2Fauth%2Fsignup
// https://panel.sierrapi.us/auth/login
// https://bot-hosting.net/
// https://geekflare.com/discord-bot-hosting/

// https://autoidle.com/blog/money-saving-tools-heroku

// pinger
// https://repl-pinger.quantumcodes.repl.co/add

//using...
//https://www.npmjs.com/package/ytdl-core
//https://discord.js.org/#/

var botOffCounter = 0;
const server = http.createServer(async function(req, res) {
	if (req.method == "OPTIONS") {
		res.writeHead(200, { Allow: 'OPTIONS, GET, HEAD, POST' });
		return;
	}
	let q = url.parse(req.url, true);
	let query = q.query;
	if (q.pathname == '/') {
		res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' });
		res.write("OK - " + (dConfig.botOn ? "ON" : "OFF") + " - " + discordAudio.getState());
		res.end();
		if (!dConfig.botOn) {
			botOffCounter += 1;
			console.log(`[SERVER] BOT OFF ${botOffCounter}`);
			if(botOffCounter >= 5){
				exec("kill 1");
			}
		}
		console.log("[SERVER] Pinged page");
	}

	if (q.pathname == "/index") {
		res.writeHead(200, { 'Content-Type': 'text/html' });

		fs.readFile("index.html", { encoding: 'utf-8' }, function(err, data) {
			res.write(data);
			res.end();
		});
	}

	if (q.pathname == "/audio") {
		// 6 sec - QohH89Eu5iM
		// 2 min - W_MKjaxRtE8
		res.writeHead(200, { 'Content-Type': 'audio/webm' });
		let videoId = q.query.videoId;
		let url = `http://youtube.com/watch?v=${videoId}`;
		let s = ytdl(url, { filter: 'audioonly', format: 'webm' });
		s.pipe(res, { end: false });
		console.log("started!");
		s.on("end", () => {
			console.log("ended!")
			res.end();
		});
	}

	if (q.pathname == "/audiolink") {
		res.writeHead(200, { 'Content-Type': 'audio/webm' });
		try {
			let video = q.query.video;
			let s = ytdl(video, { quality: "lowestaudio", filter: 'audioonly', format: 'webm' });
			s.pipe(res, { end: false });
			console.log("started video link!");
			s.on('error', (e) => {
				console.error("error " + e);
			});
			s.on("end", () => {
				console.log("ended video link!")
				res.end();
			});
		}
		catch (e) {
			console.log("error: ", e);
		}
	}

});

server.listen(8080, () => { console.log("[SERVER] SERVER IS RUNNING!") });

discord.startBot();
