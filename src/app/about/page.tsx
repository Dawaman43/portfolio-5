import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function AboutPage() {
  return (
    <main className="px-4 md:px-6 py-16 md:py-24">
      <section className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-3 text-center md:text-left">
          <Badge variant="outline" className="uppercase tracking-[0.3em]">
            About
          </Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
            Crafting useful experiences end-to-end.
          </h1>
          <p className="text-sm md:text-base text-muted-foreground md:max-w-3xl">
            I’m Dawit Worku, a 4th year Software Engineering student at Adama
            Science and Technology University, full-stack developer, and Android
            engineer who loves building tools that feel fast, polished, and
            purposeful. From product discovery to final delivery, I work across
            the stack to ship features users love.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">How I work</CardTitle>
              <CardDescription>
                I thrive in cross-functional teams where design, product, and
                engineering collaborate closely. I enjoy turning fuzzy
                requirements into actionable plans and validating ideas quickly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Rapid iteration with user feedback loops</li>
                <li>• Design system stewardship and code reviews</li>
                <li>• Metrics-driven delivery and documentation</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Outside of code</CardTitle>
              <CardDescription>
                When I’m not shipping features, you’ll find me tinkering with
                indie Android apps, reading about AI ethics, or mentoring
                early-career engineers. I’m also an avid learner who keeps a
                steady cadence of side-project experiments to explore new
                frameworks and techniques.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent highlights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                • Shipped a multi-tenant dashboard that reduced reporting time
                by 60% for Gebeya teams.
              </li>
              <li>
                • Built an Android app with on-device ML that processes
                logistics data offline.
              </li>
              <li>
                • Led an AI support copilot prototype that handles 45% of
                inbound tickets autonomously.
              </li>
            </ul>
            <div className="flex flex-wrap gap-3 text-sm">
              <Button asChild>
                <Link href="/contact">Work together</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/projects">View projects</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link
                  href="https://github.com/dawaman43"
                  target="_blank"
                  rel="noreferrer"
                >
                  Explore GitHub
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

export default AboutPage;
