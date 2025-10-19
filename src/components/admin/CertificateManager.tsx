"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { ChangeEvent, FormEvent } from "react";

function isImageUrl(url: string | null | undefined) {
  if (!url) return false;
  return /\.(png|jpe?g|gif|webp|svg)$/i.test(url);
}

function isPdfUrl(url: string | null | undefined) {
  if (!url) return false;
  return /\.pdf$/i.test(url);
}

type Certificate = {
  id: string;
  title: string;
  issuer: string | null;
  year: string | null;
  file_url: string | null;
  description: string | null;
  created_at: string | null;
};

const emptyCertificate = {
  title: "",
  issuer: "",
  year: "",
  file_url: "",
  description: "",
};

function CertificateManager() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [form, setForm] = useState(emptyCertificate);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificates = useCallback(async () => {
    setError(null);
    const { data, error: fetchError } = await supabase
      .from("certificates")
      .select("*")
      .order("created_at", { ascending: false });
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setCertificates((data ?? []) as Certificate[]);
    }
  }, []);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const path = `certificates/${Date.now()}-${file.name}`;
    const { error: storageError } = await supabase.storage
      .from("media")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: true,
      });
    if (storageError) {
      setError(storageError.message);
    } else {
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      setForm((prev) => ({ ...prev, file_url: data?.publicUrl ?? path }));
    }
    setUploading(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    const { error: insertError } = await supabase
      .from("certificates")
      .upsert(form);
    if (insertError) {
      setError(insertError.message);
    } else {
      setForm(emptyCertificate);
      fetchCertificates();
    }
  };

  const handleDelete = async (id: string) => {
    const { error: deleteError } = await supabase
      .from("certificates")
      .delete()
      .eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
    } else {
      fetchCertificates();
    }
  };

  return (
    <section className="glass-panel p-6 space-y-6">
      <header className="space-y-1">
        <h2 className="text-xl font-semibold">Certificates</h2>
        <p className="text-sm text-white/75">
          Upload certificate images or PDFs. Files are stored in Supabase
          Storage under the media bucket.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <label className="flex flex-col gap-2 text-sm">
          <span>Title</span>
          <input
            required
            value={form.title}
            onChange={(event) =>
              setForm({ ...form, title: event.target.value })
            }
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span>Issuer</span>
          <input
            value={form.issuer ?? ""}
            onChange={(event) =>
              setForm({ ...form, issuer: event.target.value })
            }
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span>Year</span>
          <input
            value={form.year ?? ""}
            onChange={(event) => setForm({ ...form, year: event.target.value })}
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span>Description</span>
          <textarea
            value={form.description ?? ""}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
            rows={3}
          />
        </label>
        <label className="md:col-span-2 flex flex-col gap-2 text-sm">
          <span>Upload file</span>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            className="text-white/80"
          />
          {uploading && <p className="text-xs text-white/60">Uploading...</p>}
          {form.file_url && (
            <div className="space-y-2">
              <p className="text-xs text-white/70 break-all">
                Uploaded file: {form.file_url}
              </p>
              {isImageUrl(form.file_url) ? (
                <div className="rounded-lg border border-white/10 bg-black/20 overflow-hidden w-full max-w-sm">
                  <img
                    src={form.file_url}
                    alt="Certificate preview"
                    className="block w-full h-40 object-contain bg-black/30"
                    loading="lazy"
                  />
                </div>
              ) : isPdfUrl(form.file_url) ? (
                <div className="rounded-lg border border-white/10 bg-black/20 overflow-hidden w-full max-w-sm h-48">
                  <iframe
                    src={form.file_url}
                    title="Certificate document preview"
                    className="w-full h-full"
                  />
                </div>
              ) : null}
            </div>
          )}
        </label>
        <div className="md:col-span-2 flex justify-end gap-3">
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button
            type="submit"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#020617] hover:bg-white/90"
            disabled={uploading}
          >
            Save certificate
          </button>
        </div>
      </form>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Uploaded certificates</h3>
        <ul className="space-y-2 text-sm text-white/80">
          {certificates.map((certificate) => (
            <li
              key={certificate.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
            >
              <div className="flex-1">
                <p className="font-semibold text-white">{certificate.title}</p>
                <p className="text-xs text-white/60">{certificate.issuer}</p>
                {certificate.file_url && (
                  <div className="mt-2 space-y-2">
                    {isImageUrl(certificate.file_url) ? (
                      <div className="rounded-lg border border-white/10 bg-black/20 overflow-hidden w-full max-w-xs">
                        <img
                          src={certificate.file_url}
                          alt={certificate.title}
                          className="block w-full h-32 object-contain bg-black/30"
                          loading="lazy"
                        />
                      </div>
                    ) : isPdfUrl(certificate.file_url) ? (
                      <div className="rounded-lg border border-white/10 bg-black/20 overflow-hidden w-full max-w-xs h-36">
                        <iframe
                          src={certificate.file_url}
                          title={`${certificate.title} document`}
                          className="w-full h-full"
                        />
                      </div>
                    ) : null}
                    <a
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/90 hover:bg-white/15"
                      href={certificate.file_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View file <span aria-hidden>↗</span>
                    </a>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(certificate.id)}
                className="self-start rounded-full border border-white/20 px-3 py-1 text-xs text-white/70 hover:bg-white/10"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default CertificateManager;
