import type {
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints.ts";
import { PropertyTypes, SelectPropertyResponse, propertyDate } from "./types";

export class Properties {
  data: PageObjectResponse["properties"];
  constructor(page: PageObjectResponse) {
    this.data = page["properties"];
  }

  getObjectPropertyByName(proprertyName: string) {
    return this.data[proprertyName];
  }

  getPropertyType(proprertyName: string) {
    return this.getObjectPropertyByName(proprertyName)?.type;
  }

  getUrl(proprertyName: string) {
    return (this.data[proprertyName] as Extract<PropertyTypes, { type: "url" }>)
      .url;
  }
  getSelect(proprertyName: string) {
    return (
      (this.data[proprertyName] as Extract<PropertyTypes, { type: "select" }>)[
        "select"
      ] as SelectPropertyResponse
    ).name;
  }

  getTitle(proprertyName: string) {
    return (
      (this.data[proprertyName] as Extract<PropertyTypes, { type: "title" }>)[
        "title"
      ] as Array<RichTextItemResponse>
    )[0]?.plain_text;
  }

  getDate(proprertyName: string) {
    const dateObject = this.data[proprertyName];
    let start = (dateObject as propertyDate)["date"]?.start;
    let end = (dateObject as propertyDate)["date"]?.end;
    start = start === null ? "" : start;
    end = end === null ? "" : end;
    return `${start} - ${end}`;
  }

  getNumber(proprertyName: string) {
    return (
      this.data[proprertyName] as Extract<PropertyTypes, { type: "number" }>
    ).number;
  }

  getPropertyByName(propertyName: string) {
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
}
