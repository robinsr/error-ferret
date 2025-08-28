import { z } from 'zod';

/*

From prompt/output.ts:

FerretFinding = {
  "file": string,                // must match an input file
  "lineIds": string[],           // 1..k ids from the provided lines of that file
  "severity": "info"|"warn"|"error",
  "focus": Focus,                // EXACTLY one from FOCUS_AREAS
  "message": string,             // concise guidance
  "codeQuote": string            // short exact excerpt; must be substring of the concatenated selected lines
}
*/


export const FindingSchema = z.object({
  file: z.string(),
  lineIds: z.array(z.string()),
  severity: z.enum(['info', 'warn', 'error']),
  focus: z.string(),
  message: z.string(),
  codeQuote: z.string(),
});

export type FerretFinding = z.infer<typeof FindingSchema>;

export const ModelFindingsSchema = z.array(FindingSchema);

export type ModelFindings = z.infer<typeof ModelFindingsSchema>;