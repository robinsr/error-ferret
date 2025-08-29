import { z } from 'zod';

/*

From prompt/output.ts:

FerretFinding = {
  "file": string,                // must match an input file
  "lineIds": string[],           // 1..k ids from the provided lines of that file
  "severity": "low"|"medium"|"high", // severity of the finding
  "focus": Focus,                // EXACTLY one from FOCUS_AREAS
  "message": string,             // concise guidance
  "codeQuote": string            // short exact excerpt; must be substring of the concatenated selected lines
}
*/

export const ModelFindingSeveritySchema = z.enum(['low', 'medium', 'high']);

export type ModelFindingSeverity = z.infer<typeof ModelFindingSeveritySchema>;

export const ModelFindingSchema = z.object({
  file: z.string(),
  lineIds: z.array(z.string()),
  severity: ModelFindingSeveritySchema,
  focus: z.string(),
  message: z.string(),
  codeQuote: z.string(),
});

export const ModelFindingsSchema = z.array(ModelFindingSchema);


export type ModelFinding = z.infer<typeof ModelFindingSchema>;
export type ModelFindings = z.infer<typeof ModelFindingsSchema>;