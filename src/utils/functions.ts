export function isNull<T>(value: T | null | undefined): value is null | undefined {
	return value === null || value === undefined;
}
export function getRandomInt(min: number, max: number): number {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Functions for returning text in Markdown

export function formatTextBold(text: string): string {
	return "*" + text.trim() + "*";
}

export function formatTextItalic(text: string): string {
	return "_" + text.trim() + "_";
}
function escapeBrackets(text: string): string {
	return text.replace(/([()])/g, "\\$1");;
}
export function formatTextForUrl(text: string, url: string): string {
	return `[${escapeBrackets(text.trim())}](${url})`
}
export type Replacment = {
	str1: string;
	str2: string;
};

export function escapeMarkdown(input: string): string {
	return input.replace(/([\\`*_{}\[\]()=#+\-.!])/g, "\\$1");
}

export function formatTextForProperMarkdown(text: string): string {

	const change_elements: Array<Replacment> = [{ str1: "_", str2: "__" }
		, { str1: ".", str2: "\\." }
		, { str1: "=", str2: "\\=" }
		, { str1: "-", str2: "\\-" }
		, { str1: "#", str2: "\\#" }];
	for (let i: number = 0; i < change_elements.length; i++) {
		text = text.replaceAll(
			change_elements[i]?.str1 as string,
			change_elements[i]?.str2 as string
		);
	}
	return text;
}
