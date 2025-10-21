import Image from "next/image";
import Link from "next/link";
import supabase from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Certificate = {
  id: string;
  title: string;
  issuer: string | null;
  year: string | null;
  file_url: string | null;
  description: string | null;
};

export const revalidate = 60;

function isImageUrl(url: string | null | undefined) {
  if (!url) return false;
  try {
    const u = new URL(url);
    const path = u.pathname.toLowerCase();
    return /\.(png|jpe?g|gif|webp|svg)$/i.test(path);
  } catch {
    const path = url.split("?")[0].toLowerCase();
    return /\.(png|jpe?g|gif|webp|svg)$/i.test(path);
  }
}

function isPdfUrl(url: string | null | undefined) {
  if (!url) return false;
  try {
    const u = new URL(url);
    const path = u.pathname.toLowerCase();
    return /\.pdf$/i.test(path);
  } catch {
    const path = url.split("?")[0].toLowerCase();
    return /\.pdf$/i.test(path);
  }
}

async function CertificatesPage() {
  let certificates: Certificate[] = [];
  let fetchError: unknown = null;
  try {
    const res = await supabase
      .from("certificates")
      .select("id, title, issuer, year, file_url, description")
      .order("created_at", { ascending: false });
    if (res.error) {
      fetchError = res.error;
    } else {
      certificates = (res.data ?? []) as Certificate[];
    }
  } catch (err) {
    fetchError = err;
  }
  return (
    <main className="px-4 md:px-6 py-16 md:py-24">
      <section className="max-w-5xl mx-auto space-y-10">
        <header className="space-y-3 text-center md:text-left">
          <Badge variant="outline" className="uppercase tracking-[0.3em]">
            Certificates
          </Badge>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
            Continuing education
          </h1>
          <p className="text-sm md:text-base text-muted-foreground md:max-w-3xl">
            I invest in structured learning to stay sharp across full-stack
            development, Android engineering, and applied AI.
          </p>
        </header>

        {!!fetchError && (
          <Card className="border-red-500/40">
            <CardContent className="p-4 text-sm text-red-300">
              Failed to load certificates.
            </CardContent>
          </Card>
        )}
        <div className="space-y-4">
          {certificates.length === 0 ? (
            <Card>
              <CardContent className="p-6 md:p-7 text-muted-foreground text-sm">
                No certificates yet.
              </CardContent>
            </Card>
          ) : (
            certificates.map((certificate) => (
              <Card key={certificate.id}>
                <CardHeader className="flex-row items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-xl">
                      {certificate.title}
                    </CardTitle>
                    {certificate.issuer ? (
                      <CardDescription>{certificate.issuer}</CardDescription>
                    ) : null}
                  </div>
                  {certificate.year ? (
                    <Badge variant="outline">{certificate.year}</Badge>
                  ) : null}
                </CardHeader>
                <CardContent>
                  {certificate.description ? (
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {certificate.description}
                    </p>
                  ) : null}
                  {certificate.file_url ? (
                    <div className="mt-4 space-y-3">
                      {isImageUrl(certificate.file_url) ? (
                        <div className="relative w-full max-w-xl aspect-[4/3] rounded-xl border border-white/10 bg-black/20 overflow-hidden">
                          <Image
                            src={certificate.file_url}
                            alt={certificate.title}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 640px"
                          />
                        </div>
                      ) : isPdfUrl(certificate.file_url) ? (
                        <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden w-full max-w-xl h-80">
                          <iframe
                            src={certificate.file_url}
                            title={`${certificate.title} document`}
                            className="w-full h-full"
                          />
                        </div>
                      ) : null}
                      <Button asChild variant="outline">
                        <Link
                          href={certificate.file_url!}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View file ↗
                        </Link>
                      </Button>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default CertificatesPage;
