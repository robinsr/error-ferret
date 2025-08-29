
/**
 * Time the execution of a function and return the result and the execution time in milliseconds
 *
 * @param fn - The function to measure the execution time of
 * @param args - The arguments to pass to the function
 * @returns The result of the function and the execution time in milliseconds
 */
export async function timeExecution<T>(
  fn: (...args: any[]) => Promise<T>, ...args: any[]
): Promise<[ T, number ]> {
  const start = performance.now();
  const result = await fn(...args); // wait for async work to finish
  const end = performance.now();

  return [ result, end - start ]
}