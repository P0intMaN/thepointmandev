import { NextResponse } from "next/server";
import { buildSearchIndex } from "@/lib/search/buildIndex";

// Force static generation so this route works with `output: export`
export const dynamic = "force-static";

export async function GET() {
  const index = buildSearchIndex();
  return NextResponse.json(index);
}
