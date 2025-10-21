import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "Full-Stack Craft",
    description:
      "Design systems, DX tooling, and resilient APIs. Clarity, performance, maintainability.",
    href: "/projects",
  },
  {
    title: "Android Experiences",
    description:
      "Compose UIs, offline-first data, and smooth performance with Kotlin.",
    href: "/projects",
  },
  {
    title: "Intelligent Features",
    description:
      "Prototype to production—LLM integrations and on-device ML responsibly.",
    href: "/blog",
  },
];

export default function FeatureGrid() {
  return (
    <section className="max-w-6xl mx-auto pb-16 md:pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {features.map((f) => (
          <Link href={f.href} key={f.title} className="group">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{f.title}</CardTitle>
                <CardDescription>{f.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="inline-flex items-center gap-2 text-sm text-white/80 group-hover:text-white transition">
                  Explore <span aria-hidden>→</span>
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
