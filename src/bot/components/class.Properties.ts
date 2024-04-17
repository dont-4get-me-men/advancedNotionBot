import type {
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { PropertyTypes, SelectPropertyResponse, propertyDate } from "./types";
import { isNull, makeTextBold } from "../utils";

export class Properties {
  data: PageObjectResponse["properties"];
  constructor(page: PageObjectResponse) {
    this.data = page["properties"];
  }

  getObjectPropertyByName(proprertyName: string) {
    return this.data[proprertyName];
  }

  getPropertyType(proprertyName: string) {
    return this.getObjectPropertyByName(proprertyName)?.type as string;
  }

  getUrl(proprertyName: string): string {
    const url = (
      this.data[proprertyName] as Extract<PropertyTypes, { type: "url" }>
    ).url;
    return isNull(url) ? "" : (url as string);
  }
  getSelect(proprertyName: string): string {
    return (
      (this.data[proprertyName] as Extract<PropertyTypes, { type: "select" }>)[
        "select"
      ] as SelectPropertyResponse
    ).name;
  }

  getTitle(proprertyName: string): string {
    const title = (
      (this.data[proprertyName] as Extract<PropertyTypes, { type: "title" }>)[
        "title"
      ] as Array<RichTextItemResponse>
    )[0]?.plain_text;
    return isNull(title) ? "" : (title as string);
  }

  getDate(proprertyName: string): string {
    const dateObject = this.data[proprertyName];
    let { start = "", end = "" } = (dateObject as propertyDate)["date"] ?? {};
    start = isNull(start) ? "" : start;
    end = isNull(end) ? "" : end;
    if (start !== "" && end !== "") return `${start} - ${end}`;
    if (start === "") return `${end}`;
    if (end === "") return `${start}`;
    return "";
  }

  getNumber(proprertyName: string): string {
    const number = (
      this.data[proprertyName] as Extract<PropertyTypes, { type: "number" }>
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
      return makeTextBold(this.getPropertyByName(propertyName)) + "\n";
    }
    return `  ${propertyName}: ${this.getPropertyByName(propertyName)}\n`;
  }

  // i guess i can do smth different here, but i am not sure how
  getNameOfTitleTypeProperty() {
    for (let i of Object.keys(this.data as object)) {
      if (this.getPropertyType(i) === "title") return i;
    }
    return "";
  }

  getTextByTypesFromPage(types: Array<string> = ["url", "date", "number"]) {
    let titleName: string = this.getNameOfTitleTypeProperty();
    var response: string = this.getNameWithValue(titleName);

    Object.keys(this.data as object)
      .map((property: keyof PageObjectResponse["properties"]) => ({
        prop: property,
        propertyType: this.getPropertyType(property),
      }))
      .filter((obj) => types.includes(obj.propertyType))
      .forEach((obj) => {
        let type;
        response += this.getNameWithValue(obj.prop);
      });

    return response;
  }
}
