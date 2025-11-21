import type {
	PageObjectResponse,
	RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { PropertyType, PropertyTypesObject, SelectPropertyResponse, propertyDate } from "./notionTypes";
import { isNull, formatTextBold } from "../utils/functions";

export class Properties {
	data: PageObjectResponse["properties"];

	constructor(page: PageObjectResponse) {
		this.data = page["properties"];
	}

	getObjectPropertyByName(propertyName: string): PropertyTypesObject | undefined {
		return this.data[propertyName];
	}


	getPropertyType(propertyName: string): PropertyType | undefined {
		return this.getObjectPropertyByName(propertyName)?.type;
	}

	getUrl(propertyName: string): string {
		const url = (
			this.data[propertyName] as Extract<PropertyTypesObject, { type: "url" }>
		).url;
		return isNull(url) ? "" : (url as string);
	}
	getSelect(propertyName: string): string {
		return (
			(this.data[propertyName] as Extract<PropertyTypesObject, { type: "select" }>)[
			"select"
			] as SelectPropertyResponse
		).name;
	}

	getTitle(propertyName: string): string {
		const title = (
			(this.data[propertyName] as Extract<PropertyTypesObject, { type: "title" }>)[
			"title"
			] as Array<RichTextItemResponse>
		)[0]?.plain_text;
		return isNull(title) ? "" : (title as string);
	}

	getDate(propertyName: string): string {
		const dateObject = this.data[propertyName];
		let { start = "", end = "" } = (dateObject as propertyDate)["date"] ?? {};
		start = isNull(start) ? "" : start;
		end = isNull(end) ? "" : end;
		if (start !== "" && end !== "") return `${start} - ${end}`;
		if (start === "") return `${end}`;
		if (end === "") return `${start}`;
		return "";
	}

	getNumber(propertyName: string): string {
		const number = (
			this.data[propertyName] as Extract<PropertyTypesObject, { type: "number" }>
		).number;
		return isNull(number) ? "" : (number as string | number).toString();
	}

	getPropertyByName(propertyName: string): string {
		const type = this.getPropertyType(propertyName);
		switch (type) {
			case "url":
				return this.getUrl(propertyName);
			case "date":
				return this.getDate(propertyName);
			case "number":
				return this.getNumber(propertyName);
			case "select":
				return this.getSelect(propertyName);
			case "title":
				return this.getTitle(propertyName);
		}
		return "";
	}

	getNameWithValue(propertyName: string): string {
		if (this.getPropertyByName(propertyName) === "") return "";
		if (this.getPropertyType(propertyName) === "title") {
			return formatTextBold(this.getPropertyByName(propertyName)) + "\n";
		}
		return `  ${propertyName}: ${this.getPropertyByName(propertyName)}\n`;
	}

	getNameOfPropertyByType(propertyType: PropertyType): string {
		for (const i of Object.keys(this.data as object)) {
			if (this.getPropertyType(i) === propertyType) return i;
		}
		return "";
	}

	getTextWithTypes(types: Array<PropertyType> = ["url", "date", "number"]) {
		const titleName: string = this.getNameOfPropertyByType("title");
		let response: string = this.getNameWithValue(titleName);

		Object.keys(this.data as object)
			.map((property: keyof PageObjectResponse["properties"]) => ({
				prop: property,
				propertyType: this.getPropertyType(property),
			}))
			.filter((obj) => typeof obj.propertyType === "string" && types.includes(obj.propertyType))
			.forEach((obj) => {
				response += this.getNameWithValue(obj.prop);
			});

		return response;
	}

	getFullProperty() {
		const titleName: string = this.getNameOfPropertyByType("title");
		let response: string = this.getNameWithValue(titleName);

		Object.keys(this.data as object)
			.map((property: keyof PageObjectResponse["properties"]) => ({
				prop: property,
				propertyType: this.getPropertyType(property),
			}))
			.filter((obj) => obj.propertyType !== "title")
			.forEach((obj) => {
				response += this.getNameWithValue(obj.prop);
			});

		return response;

	}
}

