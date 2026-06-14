import { getToolBySlug, uniqueTools } from "@/lib/tools";
import { notFound } from "next/navigation";
import ToolLayout from "@/components/ToolLayout";
import ToolProcessor from "@/components/ToolProcessor";

export async function generateStaticParams() {
  return uniqueTools.map((t) => ({ tool: t.slug }));
}

export async function generateMetadata({ params }: { params: { tool: string } }) {
  const tool = getToolBySlug(params.tool);
  if (!tool) return {};
  return {
    title: `${tool.name} - ILove2Convert`,
    description: tool.description,
  };
}

export default function ToolPage({ params }: { params: { tool: string } }) {
  const tool = getToolBySlug(params.tool);
  if (!tool) notFound();

  return (
    <ToolLayout tool={tool}>
      <ToolProcessor tool={tool} />
    </ToolLayout>
  );
}
