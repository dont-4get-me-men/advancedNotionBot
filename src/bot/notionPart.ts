import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Properties } from "./components/class.Properties";

const TELEGRAM_LIMIT = 2048;
export function getMainInfoFromDatabase(
  list: Array<PageObjectResponse>
): Array<string> {
  let response: Array<string> = [""];
  let numberOfMessages: number = 0;
  list.forEach((page) => {
    let task: Properties = new Properties(page);
    let text: string =
      task.getNameWithValue("title") + task.getTextByTypesFromPage();
    if (
      text.length + (response[numberOfMessages] as string).length >
      TELEGRAM_LIMIT
    ) {
      numberOfMessages += 1;
    }
    response[numberOfMessages] += text;
  });
  return response;
}
