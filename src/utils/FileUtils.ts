import { join } from 'path';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

export const parseCsvFileToStringArrays = (fileName: string, hideHeader = true): string[] => {
  const filePath = join(__dirname, '..', 'data', fileName);
  const stringContent = readFileSync(filePath, 'utf-8');
  const parsedContent: string[] = parse(stringContent, { delimiter: ',' });
  if(hideHeader) parsedContent.shift();
  return parsedContent;
}