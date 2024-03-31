export function isNull(value: any): boolean {
  return value === null || value === undefined;
}

// Functions for returning text in Markdown

export function makeTextBold(text: string): string {
  return "*" + text.trim() + "*";
}

export function makeTextItalic(text: string): string {
  return "_" + text.trim() + "_";
}

export function makeTextAsMarkdown(text: string): string {
  type Replacment = {
    str1: string;
    str2: string;
  };
  const change_elements: Replacment[] = [{ str1: "_", str2: "__" }];
  for (let i: number = 0; i < change_elements.length; i++) {
    text = text.replaceAll(
      change_elements[i]?.str1 as string,
      change_elements[i]?.str2 as string
    );
  }
  return text;
}
