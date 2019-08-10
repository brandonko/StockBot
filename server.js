const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const axios = require("axios")
const API_PORT = 3000;
const app = express();
const router = express.Router();

const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('bdf469f2d1c54841b3b6ba5879fecdcf');
const MSG_URI = "https://hooks.slack.com/services/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"

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// Not needed but why not
app.get("/", (req, res) => {
	res.send("<h1> wushbrackin </h1>")
})

// Top news
router.post("/news", async function (req, res) {
	res.send("this is top news from server")
	
	let res1 = await newsapi.v2.topHeadlines({
		sources: 'bbc-news,the-verge',
		q: 'apple',
		language: 'en'
	})
	console.log(res1)

	let payload = {
		"text" : JSON.stringify(res1.articles, null, 3)
	}

	axios.post(MSG_URI, payload)
	.then((res2) => console.log("sent"))
});

// Test endpoint
router.post("/stonks", async function (req, res) {

	// Python script for scraping data
	let spawn = require("child_process").spawn;
	let pythonProcess = spawn('python',["./parse_sa.py"]);

	pythonProcess.stdout.on('data', (data) => {
		let str = data.toString()
		let js = JSON.parse(str.replace(/'/g, '"'))
		// console.log(JSON.stringify(js, null, 3))

		// Format the message
		let search = req.body.text;
		let msg = 
		{
			"blocks": 
			[
			{
				"type": "section",
				"text": {
					"type": "mrkdwn",
					"text": "Here is some information on the stock market for " + search + ":"
				}
			},
			{
				"type": "divider"
			}
			]
		}

		let keys = Object.keys(js);
		for (let i = 0; i < keys.length; i++) {
			let title = keys[i]
			let article = JSON.parse(js[title])
			let description = "";

			for (let j = 0; j < article.bullets.length; j++) {
				description += "\n • " + article.bullets[j]
			}
			let link = "link"

			let webpage = 
			{
				"type": "section",
				"text": {
					"type": "mrkdwn",
					"text": "*" + title
					+ "* \n"
					+ description
					+ "\n <" 
					+ link 
					+ "|More Information>"
				}
			}
			msg.blocks.push(webpage);
		}
		res.send(msg)
	})
});

let s = '{"first": true}'
JSON.parse(s)

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));