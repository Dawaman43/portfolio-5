"use client";

import Header from "@/components/layout/header";
import ScrollProgress from "@/components/ui/scroll-progress";
import { usePathname } from "next/navigation";

export default function SiteChrome() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  if (isAdmin) return null;
  return (
    <>
      <Header />
      <ScrollProgress />
    </>
  );
}
