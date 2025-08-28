

/**
 * Clean the model response to remove the markdown code block
 * and parses the JSON
 *
 * @param response - The model response to clean
 * @returns The cleaned JSON
 */
export function cleanModelResponse<T>(response: string): T {
  const jsonText = response.replace(/```json/g, '').replace(/```/g, '');

  try {
    return JSON.parse(jsonText) as T;
  } catch (error) {
    console.error('Error parsing model response:', error);
    throw error;
  }
}