
import { promises as fs } from 'fs';

/**
 * Reads content from a file on the local file system.
 * @param path - The absolute path of the file to read from.
 * @returns A promise that resolves with the content of the file.
 */
export const readFile = async (path: string): Promise<string> => {
  try {
    const content = await fs.readFile(path, 'utf8');
    console.log(`Successfully read from ${path}`);
    return content;
  } catch (error) {
    console.error(`Error reading from ${path}:`, error);
    throw new Error(`Failed to read from ${path}`);
  }
};
