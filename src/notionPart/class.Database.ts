import { Client } from "@notionhq/client";
import { isNull } from "../utils/functions";
import { CreatePageParameters, QueryDatabaseParameters, QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

export class Database {

	databaseId: string = "";
	client: Client;
	_databaseProperties: Record<string, string>;
	titleFieldName: string;
	urlFieldName: string;
	bucketFieldName: string;

	constructor(notionClient: Client, id: string) {
		this.client = notionClient;
		this.databaseId = id;
		this._databaseProperties = {};
	}

	async extractDatabaseProperties() {
		const responce = await this.client.databases.retrieve({
			database_id: this.databaseId
		});


		for (const obj of Object.keys(responce.properties)) {
			const type: string | undefined = responce.properties[obj]?.type
			if (type !== undefined) {
				this._databaseProperties[obj] = type
				if (type === "title") {
					this.titleFieldName = obj;

				} else if (type === "url") {
					this.urlFieldName = obj;

				} else if (type === "select") {
					this.bucketFieldName = obj;
				}
			}
		}
	}

	async createPage(title: string, url?: string, insidePage?: string) {
		const properties: CreatePageParameters['properties'] = {};

		if (!isNull(title)) {
			properties[this.titleFieldName] = { title: [{ text: { content: title } }], type: "title" };
		}

		if (!isNull(url)) {
			properties[this.urlFieldName] = { url, type: "url" };
		}

		properties[this.bucketFieldName] = { select: { name: "Inbox" }, type: "select" };

		const pagePayload: CreatePageParameters = {
			parent: { database_id: this.databaseId },
			properties,
		};

		if (!isNull(insidePage)) {
			pagePayload.children = [
				{
					object: "block",
					type: "paragraph",
					paragraph: {
						rich_text: [{ type: "text", text: { content: insidePage as string, } },]
					}
				}];
		}
		return await this.client.pages.create(pagePayload);
	}

	async getAllRecordsFromDatabase() {
		return await this.client.databases.query({
			database_id: this.databaseId,
		});
	}

	async getFilteredRecordsFromDatabase(filters: QueryDatabaseParameters["filter"]) {
		return await this.client.databases.query({
			database_id: this.databaseId,
			filter: filters
		})
	}

}
