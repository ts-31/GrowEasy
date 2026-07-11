import fs from 'fs';

/**
 * Safely deletes a file at the given path.
 * Silently ignores errors if the file doesn't exist.
 */
export function deleteFile(filePath: string): void {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error(`Failed to delete temp file: ${filePath}`, err);
  }
}
