import type { ReviewArtifactFile } from '@errorferret/types'

export function readFileToArtifact(file: File): Promise<ReviewArtifactFile> {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve({
        type: 'file',
        filename: file.name,
        code: text
      });
    };

    reader.onerror = () => {
      reject(new Error("Error reading the file. Please try again."));
    };

    reader.readAsText(file);
  })
}
