import { inter } from "@/lib/fonts";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
  { name: "Certificates", href: "/certificates" },
  { name: "Blog", href: "/blog" },
];

function Header() {
  return (
    <header className="sticky top-0 z-50">
      <div className="pt-[max(env(safe-area-inset-top),0.75rem)] px-4">
        <div className="flex justify-center">
          <nav
            aria-label="Primary"
            className="transition-[transform,opacity] duration-300 ease-out will-change-transform"
          >
            <ul className="liquid-glass liquid-noise shadow-[0_8px_40px_rgba(0,0,0,0.25)] px-5 md:px-7 py-3 md:py-3.5 gap-x-6 md:gap-x-10">
              {navLinks.map((link) => (
                <li key={link.name} className="list-none">
                  <a
                    className={`${inter.className} text-sm md:text-base font-semibold  hover:text-white transition-colors drop-shadow-[0_1px_0_rgba(0,0,0,0.4)]`}
                    href={link.href}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
