import type { Metadata } from "next";
import { RoadmapContent } from "./RoadmapContent";

export const metadata: Metadata = {
  title: "Senior Engineer Roadmap | thepointman.dev",
  description:
    "A structured 12-week interview roadmap covering Java mastery, DSA patterns, and system design concepts for senior engineering roles.",
};

export default function RoadmapPage() {
  return <RoadmapContent />;
}
