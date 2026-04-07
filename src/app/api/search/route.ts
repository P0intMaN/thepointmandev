import { NextResponse } from "next/server";
import { buildSearchIndex } from "@/lib/search/buildIndex";

// Cache the index at the module level during build
let cachedIndex: ReturnType<typeof buildSearchIndex> | null = null;

export async function GET() {
  if (!cachedIndex) {
    cachedIndex = buildSearchIndex();
  }
  return NextResponse.json(cachedIndex);
}
