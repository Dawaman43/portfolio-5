"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactElement } from "react";
import supabase from "@/lib/supabase";

type Comment = {
  id: string;
  slug: string;
  name: string | null;
  message: string;
  created_at: string | null;
  parent_id: string | null;
  likes: number | null;
};

type CommentForm = {
  name: string;
  message: string;
};

type CommentNode = Comment & {
  children: CommentNode[];
};

const emptyForm: CommentForm = {
  name: "",
  message: "",
};

function formatDate(value: string | null) {
  if (!value) return "Just now";
  try {
    const formatter = new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
    return formatter.format(new Date(value));
  } catch {
    return value ?? "";
  }
}

function buildCommentTree(items: Comment[]): CommentNode[] {
  const map = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  items.forEach((item) => {
    map.set(item.id, { ...item, likes: item.likes ?? 0, children: [] });
  });

  map.forEach((node) => {
    if (node.parent_id && map.has(node.parent_id)) {
      map.get(node.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  const sortRecursive = (nodes: CommentNode[]) => {
    nodes.sort((a, b) => {
      const aTime = new Date(a.created_at ?? 0).getTime();
      const bTime = new Date(b.created_at ?? 0).getTime();
      return aTime - bTime;
    });
    nodes.forEach((child) => sortRecursive(child.children));
  };

  sortRecursive(roots);
  return roots;
}

type CommentSectionProps = {
  slug: string;
  initialCount?: number;
};

function CommentSection({ slug, initialCount = 0 }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentNode[]>([]);
  const [form, setForm] = useState<CommentForm>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commentCount, setCommentCount] = useState(initialCount);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyForm, setReplyForm] = useState<CommentForm>(emptyForm);
  const [replyLoading, setReplyLoading] = useState(false);
  const [likeBusy, setLikeBusy] = useState<string | null>(null);
  const [copiedComment, setCopiedComment] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    setError(null);
    const { data, error: fetchError } = await supabase
      .from("blog_comments")
      .select("id, slug, name, message, created_at, parent_id, likes")
      .eq("slug", slug)
      .order("created_at", { ascending: true });
    if (fetchError) {
      setError(fetchError.message);
    } else {
      const items = (data ?? []) as Comment[];
      const tree = buildCommentTree(items);
      setComments(tree);
      setCommentCount(items.length);
    }
  }, [slug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.message.trim()) {
      setError("Comment cannot be empty.");
      return;
    }
    setLoading(true);
    setError(null);
    const payload = {
      slug,
      name: form.name.trim() || "Anonymous",
      message: form.message.trim(),
    };
    const { error: insertError } = await supabase
      .from("blog_comments")
      .insert(payload);
    if (insertError) {
      setError(insertError.message);
    } else {
      setForm(emptyForm);
      fetchComments();
    }
    setLoading(false);
  };

  const handleReplySubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    parentId: string
  ) => {
    event.preventDefault();
    if (!replyForm.message.trim()) {
      setError("Reply cannot be empty.");
      return;
    }
    setReplyLoading(true);
    setError(null);
    const payload = {
      slug,
      name: replyForm.name.trim() || "Anonymous",
      message: replyForm.message.trim(),
      parent_id: parentId,
    };
    const { error: insertError } = await supabase
      .from("blog_comments")
      .insert(payload);
    if (insertError) {
      setError(insertError.message);
    } else {
      setReplyForm(emptyForm);
      setReplyingTo(null);
      fetchComments();
    }
    setReplyLoading(false);
  };

  const toggleReply = (commentId: string) => {
    setError(null);
    setReplyForm(emptyForm);
    setReplyingTo((prev) => (prev === commentId ? null : commentId));
  };

  const updateLikesInState = (
    nodes: CommentNode[],
    targetId: string,
    nextLikes: number
  ): CommentNode[] => {
    return nodes.map((node) => {
      if (node.id === targetId) {
        return {
          ...node,
          likes: nextLikes,
          children: updateLikesInState(node.children, targetId, nextLikes),
        };
      }
      if (node.children.length > 0) {
        return {
          ...node,
          children: updateLikesInState(node.children, targetId, nextLikes),
        };
      }
      return node;
    });
  };

  const handleLike = async (commentId: string, currentLikes: number) => {
    setError(null);
    setLikeBusy(commentId);
    const nextLikes = currentLikes + 1;
    setComments((prev) => updateLikesInState(prev, commentId, nextLikes));
    const { error: likeError } = await supabase
      .from("blog_comments")
      .update({ likes: nextLikes })
      .eq("id", commentId)
      .select("id");
    if (likeError) {
      setError(likeError.message);
      fetchComments();
    }
    setLikeBusy(null);
  };

  const handleShare = async (commentId: string) => {
    setError(null);
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const permalink = `${origin}/blog/${encodeURIComponent(
      slug
    )}#comment-${commentId}`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ url: permalink, title: "Comment" });
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(permalink);
        setCopiedComment(commentId);
        setTimeout(() => setCopiedComment(null), 2200);
      }
    } catch (shareError) {
      if (shareError instanceof Error) {
        setError(shareError.message);
      }
    }
  };

  const renderThread = (nodes: CommentNode[]): ReactElement => {
    return (
      <ul className="space-y-3">
        {nodes.map((comment) => (
          <li
            key={comment.id}
            id={`comment-${comment.id}`}
            className="glass-panel p-4 space-y-3"
          >
            <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-widest text-white/60">
              <span>{comment.name ?? "Anonymous"}</span>
              <span>{formatDate(comment.created_at)}</span>
            </div>
            <p className="text-sm leading-relaxed text-white/80 whitespace-pre-line">
              {comment.message}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
              <button
                type="button"
                onClick={() => handleLike(comment.id, comment.likes ?? 0)}
                disabled={likeBusy === comment.id}
                className="flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 font-semibold text-white/70 hover:bg-white/15 disabled:opacity-60"
              >
                ❤️ <span>{comment.likes ?? 0}</span>
              </button>
              <button
                type="button"
                onClick={() => handleShare(comment.id)}
                className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 font-semibold text-white/70 hover:bg-white/15"
              >
                Share
              </button>
              <button
                type="button"
                onClick={() => toggleReply(comment.id)}
                className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70 hover:text-white transition"
              >
                Reply
              </button>
              {copiedComment === comment.id && (
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-emerald-200">
                  Link copied
                </span>
              )}
            </div>
            {replyingTo === comment.id && (
              <form
                onSubmit={(event) => handleReplySubmit(event, comment.id)}
                className="mt-3 space-y-3 rounded-xl border border-white/15 bg-white/5 p-3"
              >
                <div className="grid grid-cols-1 gap-3 text-xs">
                  <label className="flex flex-col gap-2">
                    <span>Name</span>
                    <input
                      value={replyForm.name}
                      onChange={(event) =>
                        setReplyForm((prev) => ({
                          ...prev,
                          name: event.target.value,
                        }))
                      }
                      className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
                      placeholder="Your name (optional)"
                      maxLength={60}
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span>Reply</span>
                    <textarea
                      required
                      value={replyForm.message}
                      onChange={(event) =>
                        setReplyForm((prev) => ({
                          ...prev,
                          message: event.target.value,
                        }))
                      }
                      rows={3}
                      className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
                      placeholder="Write your reply"
                      maxLength={600}
                    />
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={replyLoading}
                    className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#020617] hover:bg-white/90 disabled:opacity-60"
                  >
                    {replyLoading ? "Posting..." : "Post reply"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60 hover:text-white/80"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
            {comment.children.length > 0 && (
              <div className="pl-4 md:pl-6 border-l border-white/10 space-y-3">
                {renderThread(comment.children)}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const commentLabel = `${commentCount} comment${
    commentCount === 1 ? "" : "s"
  }`;

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-semibold text-white">Comments</h2>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
            {commentLabel}
          </span>
        </div>
        <p className="text-sm text-white/70">
          Join the discussion. Comments are public and appear immediately.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="glass-panel p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2 text-sm">
            <span>Name</span>
            <input
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
              placeholder="Your name (optional)"
              maxLength={60}
            />
          </label>
        </div>
        <label className="flex flex-col gap-2 text-sm">
          <span>Comment</span>
          <textarea
            required
            value={form.message}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, message: event.target.value }))
            }
            rows={4}
            className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
            placeholder="Share your thoughts"
            maxLength={1000}
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          {error && (
            <p className="text-sm text-red-300" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#020617] hover:bg-white/90 disabled:opacity-60"
          >
            {loading ? "Posting..." : "Post comment"}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {commentCount === 0 ? (
          <p className="text-sm text-white/60">
            Be the first to leave a comment.
          </p>
        ) : (
          renderThread(comments)
        )}
      </div>
    </section>
  );
}

export default CommentSection;
