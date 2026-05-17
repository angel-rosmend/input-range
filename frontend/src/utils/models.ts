import { z } from "zod";

export const RangeModeSchema = z.enum(["fixed", "normal"], { message: "Invalid range mode" });

export const FixedRangeResponse = z.object({
  rangeValues: z.array(z.number()),
});
export const NormalRangeResponse = z.object({
  min: z.number(),
  max: z.number(),
});

export type RangeModeType = z.infer<typeof RangeModeSchema>;
export type FixedRangeType = z.infer<typeof FixedRangeResponse>;
export type NormalRangeType = z.infer<typeof NormalRangeResponse>;
