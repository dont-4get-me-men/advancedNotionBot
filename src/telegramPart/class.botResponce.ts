import { isNull } from "../utils/functions";
import { getUrlTitle } from "../otherServices/titleFetcher";
import { getYouTubeVideoTitle } from "../otherServices/youtubeFetcher";
import { urlRegex } from "../utils/constants";


export class TextBotResponse {
	initialText: string;
	urls: string[] | null;
	titleText: string;
	bodyText: string;

	constructor(text: string) {
		this.initialText = text;
		this.urls = [];
		this.titleText = "";
		this.bodyText = "";
	}

	parseUrls() {
		this.urls = this.initialText.match(urlRegex);
	}

	async changeUrlsToText() {
		if (isNull(this.urls)) {
			return
		}
		for (let url of this.urls) {
			let result: string = "";
			if (url.includes("youtube")) {
				result = await getYouTubeVideoTitle(url)
			}
			else {
				result = await getUrlTitle(url);
			}

			if (result === "" || result.includes("Error")) {
				return
			}
			this.initialText = this.initialText.replaceAll(url, result);
		}
	}

	removeUrlsFromText() {
		this.initialText = this.initialText.replaceAll(urlRegex, "");
	}

	splitTitleAndBody() {
		const lines = this.initialText.split("\n");

		if (lines.length > 1) {
			this.bodyText = lines.slice(1).join("\n");
		}

		this.titleText = lines[0] as string;
	}

	async processText(needChange: boolean = true) {
		this.parseUrls();
		if (needChange) {
			await this.changeUrlsToText();
		}
		else {
			this.removeUrlsFromText();
		}
		this.splitTitleAndBody();
	}

	get fullObject() {
		return {
			urls: this.urls,
			titleText: this.titleText,
			bodyText: this.bodyText
		}
	}

	get task() {
		return {
			title: this.titleText
			, url: this.urls?.[0]
			, insideText: this.bodyText
		}
	}
}
