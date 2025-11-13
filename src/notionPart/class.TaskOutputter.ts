import { PageObjectResponse, QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints"
import { Properties } from "./class.Properties";
import { isNull, formatTextForUrl } from "../utils/functions";
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
			result += `${index + 1}. ${formatTextForUrl(title, url)}\n`;
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
}
