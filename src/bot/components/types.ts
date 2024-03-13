import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints.ts";

export type SelectPropertyResponse = {
  id: string;
  name: string;
  color: string;
};
export type ExtractRecordValue<R> = R extends Record<infer _, infer V>
  ? V
  : never;
export type PropertyTypes = ExtractRecordValue<
  PageObjectResponse["properties"]
>;

export type propertyDate = Extract<PropertyTypes, { type: "date" }>;
export type pageProperties = PageObjectResponse["properties"];
