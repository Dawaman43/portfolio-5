"use client";

import { useEffect, useState } from "react";

import AdminHeader from "../../components/admin/AdminHeader";
import BlogManager from "../../components/admin/BlogManager";
import CertificateManager from "../../components/admin/CertificateManager";
import SkillManager from "../../components/admin/SkillManager";
import BacklinkManager from "../../components/admin/BacklinkManager";
import ProjectsManager from "../../components/admin/ProjectsManager";
import SiteSettings from "../../components/admin/SiteSettings";

const tabs = [
  { id: "blogs", label: "Blogs" },
  { id: "projects", label: "Projects" },
  { id: "certificates", label: "Certificates" },
  { id: "skills", label: "Skills" },
  { id: "backlinks", label: "Backlinks" },
  { id: "settings", label: "Site Settings" },
];

function AdminPage() {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id ?? "blogs");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const VALID_EMAIL = "dawitworkujima@gmail.com";
  const VALID_PASSWORD = "yordanos";

  useEffect(() => {
    try {
      const cached = localStorage.getItem("admin_auth_v1");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.ok === true) {
          setAuthed(true);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      setAuthed(true);
      setError(null);
      try {
        localStorage.setItem("admin_auth_v1", JSON.stringify({ ok: true }));
      } catch {
        // ignore
      }
    } else {
      setError("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setAuthed(false);
    try {
      localStorage.removeItem("admin_auth_v1");
    } catch {
      // ignore
    }
  };

  return (
    <main className="px-4 md:px-6 pb-16 md:pb-24 pt-10">
      <section className="max-w-6xl mx-auto space-y-8">
        {/* Admin-only header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-extrabold">Admin</h1>
          {authed ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/15"
            >
              Logout
            </button>
          ) : null}
        </div>
        <AdminHeader />

        {!authed ? (
          <form
            onSubmit={handleLogin}
            className="glass-panel p-6 md:p-8 max-w-md space-y-4"
          >
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Sign in</h2>
              <p className="text-sm text-white/70">
                Restricted area. Enter your admin credentials.
              </p>
            </div>
            <label className="flex flex-col gap-2 text-sm">
              <span>Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              <span>Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
              />
            </label>
            {error && <p className="text-sm text-red-300">{error}</p>}
            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#020617] hover:bg-white/90"
              >
                Sign in
              </button>
            </div>
          </form>
        ) : null}

        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Admin workspace
          </h2>
          <p className="text-sm md:text-base text-white/75">
            Manage blogs, certificates, skills, and backlinks from one calm hub.
          </p>
        </div>

        {authed && (
          <div className="glass-panel p-4 md:p-5">
            <nav className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? "bg-white text-[#020617]"
                      : "bg-white/10 text-white/80 hover:bg-white/15"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        )}

        {authed && activeTab === "blogs" && <BlogManager />}
        {authed && activeTab === "projects" && <ProjectsManager />}
        {authed && activeTab === "certificates" && <CertificateManager />}
        {authed && activeTab === "skills" && <SkillManager />}
        {authed && activeTab === "backlinks" && <BacklinkManager />}
        {authed && activeTab === "settings" && <SiteSettings />}
      </section>
    </main>
  );
}

export default AdminPage;
