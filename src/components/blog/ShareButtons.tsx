"use client";

import { useState } from "react";

type ShareButtonsProps = {
  title: string;
  url: string;
};

function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch (error) {
      console.error("Failed to copy", error);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        console.warn("Share cancelled", error);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <button
        type="button"
        onClick={handleNativeShare}
        className="share-btn rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white/80 hover:bg-white/15"
      >
        Share post
      </button>
      <a
        href={links.twitter}
        target="_blank"
        rel="noreferrer"
        className="share-btn rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white/80 hover:bg-white/15"
      >
        Tweet
      </a>
      <a
        href={links.linkedin}
        target="_blank"
        rel="noreferrer"
        className="share-btn rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white/80 hover:bg-white/15"
      >
        Share on LinkedIn
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="share-btn rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white/80 hover:bg-white/15"
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}

export default ShareButtons;
