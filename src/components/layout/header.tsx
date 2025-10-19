import { inter, playfair } from "@/lib/fonts";

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
    <div>
      <nav>
        <h1 className={playfair.className + " text-2xl font-bold mb-2"}>
          Dawit Worku
        </h1>
        <ul className="flex gap-4 border-gray-300 border p-4 rounded-2xl w-fit">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a className={`${inter.className} text-base`} href={link.href}>
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Header;
