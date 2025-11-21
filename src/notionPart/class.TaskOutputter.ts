import { PageObjectResponse, QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints"
import { Properties } from "./class.Properties";
import { isNull, formatTextForUrl, getRandomInt } from "../utils/functions";
import { propertyDate, PropertyType } from "./notionTypes";

export class TasksOutputer {
	tasks: Array<PageObjectResponse>;
	urlField: string;
	titleField: string;
	fieldsToShow?: Array<PropertyType>;


	constructor(tasks: Array<PageObjectResponse>
		, fieldsToShow?: Array<PropertyType>) {
		this.tasks = tasks;
		this.fieldsToShow = fieldsToShow;
		this.titleField = "";
		this.urlField = "";
		this.initBasicFieldNames();
	}

	initBasicFieldNames() {
		if (isNull(this.tasks[0])) return;
		const dbFields = new Properties(this.tasks[0]);
		this.titleField = dbFields.getNameOfPropertyByType("title");
		this.urlField = dbFields.getNameOfPropertyByType("url");

	}

	listTaskNames(): string {
		let result = "";
		for (const [index, task] of this.tasks.entries()) {
			const properties = new Properties(task);
			result += `${index + 1}. ${properties.getPropertyByName(this.titleField)}\n`
		}
		return result;
	}

	listTaskAndUrls(): string {
		let result = "";

		for (const [index, task] of this.tasks.entries()) {
			const properties = new Properties(task);
			const title = properties.getPropertyByName(this.titleField);
			const url = properties.getPropertyByName(this.urlField);
			if (isNull(url)) {
				result += `${index + 1}. ${title}`
			}
			else {
				result += `${index + 1}. ${formatTextForUrl(title, url)}\n`;
			}
		}
		return result;
	}

	listTaskWithFields(): string {
		let result = "";

		for (const [index, task] of this.tasks.entries()) {
			const properties = new Properties(task);
			const neededFields = properties.getTextWithTypes(this.fieldsToShow);
			result += `${index + 1}. ${neededFields}\n`;
		}

		return result;
	}

	getRandomTask(): string {
		let response: string = "";
		const choosenPos = getRandomInt(0, this.tasks.length - 1);
		const task = this.tasks[choosenPos] as PageObjectResponse;

		const properties = new Properties(task);

		return properties.getFullProperty();
	}
}
