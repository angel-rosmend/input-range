import { z } from "zod";
export const FixedRangeResponse = z.object({
  rangeValues: z.array(z.number()),
});
export const NormalRangeResponse = z.object({
  min: z.number(),
  max: z.number(),
});
export type FixedRangeType = z.infer<typeof FixedRangeResponse>;
export type NormalRangeType = z.infer<typeof NormalRangeResponse>;
