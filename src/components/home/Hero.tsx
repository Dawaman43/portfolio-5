import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative max-w-6xl mx-auto pt-16 md:pt-24 pb-12 md:pb-20">
      <div className="text-center md:text-left">
        <Badge className="mx-auto md:mx-0" variant="secondary">
          Full-Stack • Android • AI/ML
        </Badge>
        <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight">
          Dawit Worku
        </h1>
        <p className="mt-4 md:mt-6 text-base md:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto md:mx-0">
          I design and build across web, Android, and AI/ML—shipping polished
          UIs, reliable APIs, and intelligent features.
        </p>
        <div className="mt-8 flex items-center justify-center md:justify-start gap-3 md:gap-4">
          <Button asChild>
            <Link href="/projects">View Projects</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/contact">Contact</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
