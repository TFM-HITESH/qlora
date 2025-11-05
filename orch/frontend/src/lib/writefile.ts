
import { promises as fs } from 'fs';

/**
 * Writes content to a file on the local file system.
 * @param path - The absolute path of the file to write to.
 * @param content - The content to write to the file.
 * @returns A promise that resolves when the file has been written.
 */
export const writeFile = async (path: string, content: string): Promise<void> => {
  try {
    await fs.writeFile(path, content, 'utf8');
    console.log(`Successfully wrote to ${path}`);
  } catch (error) {
    console.error(`Error writing to ${path}:`, error);
    throw new Error(`Failed to write to ${path}`);
  }
};
