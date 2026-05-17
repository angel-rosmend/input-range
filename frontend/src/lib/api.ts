import { RangeMode } from "@/types/range";
import { FixedRangeResponse, NormalRangeResponse } from "@/utils/models";
const BASE_URL = "http://localhost:8080";
const API_URL = "/api/range?mode";

export async function fetchRangeData(mode: RangeMode) {
  console.log(`Fetching range data for mode: ${mode} -  ${BASE_URL}${API_URL}=${mode}`);
  try {
    const response = await fetch(`${BASE_URL}${API_URL}=${mode}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
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
