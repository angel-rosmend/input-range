import { RangeMode } from "@/types/range";
import {
  FixedRangeResponse,
  NormalRangeResponse
} from "@/utils/models";

const API_URL = "http://localhost:4000/range";

export async function fetchRangeData(mode: RangeMode) {
  try {
    const response = await fetch(
      `${API_URL}?mode=${mode}`, {cache: 'no-store'}
    );
    const rawData = await response.json();
    switch (mode) {
      case RangeMode.Normal:
        return NormalRangeResponse.parse(rawData);
      case RangeMode.Fixed:
        return FixedRangeResponse.parse(rawData);
      default:
        throw new Error("Invalid mode");
    }
  } catch (error) {
    console.error("Failed to fetch range data:", error);
    throw new Error("Failed to fetch range data");
  }
}
