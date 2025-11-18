import { Bot, type Context } from "grammy";
import { TasksOutputer } from "./src/notionPart/class.TaskOutputter";
import { Client } from "@notionhq/client";
import { type FileFlavor, hydrateFiles } from "@grammyjs/files";
import * as dotenv from "dotenv";
import { TextBotResponse } from "./src/telegramPart/class.botResponce";
import { Database } from "./src/notionPart/class.Database";
import { isNull } from "./src/utils/functions";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
type MyContext = FileFlavor<Context>;

const commands = `
  start - Restart bot
  all - Get all Database
  buy - List of purchase that i need to buy
  todo - get all todos in base
`;


dotenv.config();

const args = process.argv.slice(2);
const notionClient = new Client({ auth: process.env["NOTION_API"] });

let databaseDBstring: string;
let botTokenString: string;

if (args[0] !== null && args[0] === "prod") {
	databaseDBstring = "NOTION_DB";
	botTokenString = "BOT_TOKEN";
}
else {
	databaseDBstring = "TEST_NOTION_DB";
	botTokenString = "TEST_BOT_TOKEN";
}
const databaseId = process.env[databaseDBstring] as string;
const bot = new Bot<MyContext>(process.env[botTokenString] as string);
const notionDB = new Database(notionClient, databaseId);

(async () => { await notionDB.extractDatabaseProperties() })();


bot.command("start", (ctx) => ctx.reply("You've started this bot"));
bot.command("all", async (ctx) => {
	console.log("All comand");
	const tasks = await notionDB.getAllRecordsFromDatabase();
	const res = tasks.results;
	const output = new TasksOutputer(res as PageObjectResponse[], ["url"]);
	ctx.reply(output.listTaskAndUrls());
});
bot.command("now", async (ctx) => {
	const tasks = await notionDB.getFilteredRecordsFromDatabase({
		property: "Bucket",
		select: { equals: "NOW" }
	});
	const res = tasks.results;
	const output = new TasksOutputer(res as PageObjectResponse[], ["url"]);
	ctx.reply(output.listTaskAndUrls());
});

bot.command("week", async (ctx) => {
	const tasks = await notionDB.getFilteredRecordsFromDatabase({
		property: "Bucket",
		select: { equals: "WEEK" }
	});
	const res = tasks.results;
	const output = new TasksOutputer(res as PageObjectResponse[], ["url"]);
	ctx.reply(output.listTaskAndUrls());
});
bot.on("message:text", async (ctx) => {
	console.log("Regular message");
	const message = ctx.message.text;
	const messageText = new TextBotResponse(message);
	await messageText.processText();
	const newPageParams: [string, string | undefined, string] = [messageText.task.title, messageText.task.url, messageText.task.insideText];

	const res = await notionDB.createPage(...newPageParams);
	if (!isNull(res.id)) {
		ctx.react("👍");
	}
	else {
		ctx.reply("Got an error");
	}
});
bot.on("message:voice", async (ctx) => {
	console.log('Recieved voice');
	const voice = ctx.message.voice;
	console.log(voice.duration);
	//const fileLink = await ctx.api.getFile(voice.file_id);
	await ctx.reply(`Got a voice message (${voice.duration}s)}`);
});
bot.start();
