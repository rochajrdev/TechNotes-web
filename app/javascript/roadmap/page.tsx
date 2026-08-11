import type { Metadata } from "next";
import { JavaScriptRoadmap } from "./flow-roadmap";

export const metadata: Metadata = {
  title: "Roadmap JavaScript — TechNotes",
  description: "Uma trilha visual e interativa para estudar JavaScript do básico ao avançado.",
};

export default function JavaScriptRoadmapPage() {
  return <JavaScriptRoadmap />;
}
