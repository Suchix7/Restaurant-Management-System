import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "@/lib/axiosInstance.js";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, ImagePlus, Trash2, RefreshCw } from "lucide-react";

const MAX_SLOTS = 3;

const emptySlot = () => ({ linkUrl: "", file: null, preview: null });

const ManagePosts = () => {
  const [posts, setPosts] = useState([]); // always sorted newest -> oldest
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState([false, false, false]); // per slot busy state
  const [slots, setSlots] = useState([emptySlot(), emptySlot(), emptySlot()]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/admin/posts");
      // Server route already sorts by createdAt:-1, but sort again just in case
      const sorted = (data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPosts(sorted.slice(0, MAX_SLOTS));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const setSlotBusy = (idx, val) =>
    setBusy((prev) => prev.map((b, i) => (i === idx ? val : b)));

  const onFileChange = (idx, file) => {
    setSlots((prev) => {
      const clone = [...prev];
      clone[idx] = {
        ...clone[idx],
        file: file || null,
        preview: file ? URL.createObjectURL(file) : null,
      };
      return clone;
    });
  };

  const onLinkChange = (idx, linkUrl) => {
    setSlots((prev) => {
      const clone = [...prev];
      clone[idx] = { ...clone[idx], linkUrl };
      return clone;
    });
  };

  const clearSlotInputs = (idx) =>
    setSlots((prev) => {
      const clone = [...prev];
      clone[idx] = emptySlot();
      return clone;
    });

  const handleReplaceOrCreate = async (idx) => {
    const slot = slots[idx];
    if (!slot.linkUrl.trim()) return toast.error("Please enter a link URL");
    if (!slot.file) return toast.error("Please select an image");
    try {
      setSlotBusy(idx, true);

      // If a post exists at this position, delete first (replace)
      const existing = posts[idx];
      if (existing?._id) {
        await axiosInstance.delete(`/admin/posts/${existing._id}`);
      }

      const form = new FormData();
      form.append("linkUrl", slot.linkUrl.trim());
      form.append("image", slot.file);
      await axiosInstance.post("/admin/posts", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(existing ? "Post replaced" : "Post created");
      clearSlotInputs(idx);
      await loadPosts();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to save post");
    } finally {
      setSlotBusy(idx, false);
    }
  };

  const handleRemove = async (idx) => {
    const existing = posts[idx];
    if (!existing) return;
    if (!window.confirm("Remove this post?")) return;
    try {
      setSlotBusy(idx, true);
      await axiosInstance.delete(`/admin/posts/${existing._id}`);
      toast.success("Post removed");
      await loadPosts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove post");
    } finally {
      setSlotBusy(idx, false);
    }
  };

  const usedCount = posts.length;
  const usageText = useMemo(
    () => `Using ${usedCount}/${MAX_SLOTS} slots (most recent appears first)`,
    [usedCount]
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Manage posts</h2>
          <p className="text-slate-600">{usageText}</p>
        </div>
        <Button
          variant="secondary"
          onClick={loadPosts}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.from({ length: MAX_SLOTS }).map((_, idx) => {
            const existing = posts[idx]; // newest at index 0
            const slot = slots[idx];
            const isBusy = busy[idx];

            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">
                    {`Post #${idx + 1}`}{" "}
                    <span className="text-xs text-slate-500">
                      {idx === 0 ? "(Most recent)" : null}
                    </span>
                  </h3>
                  {existing && (
                    <Button
                      variant="ghost"
                      className="text-red-600"
                      onClick={() => handleRemove(idx)}
                      disabled={isBusy}
                      title="Remove current post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Current (if any) */}
                {existing ? (
                  <div className="space-y-2">
                    <div className="text-xs uppercase text-slate-500">
                      Current
                    </div>
                    <a
                      href={existing.linkUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block"
                    >
                      <img
                        src={existing.image?.imageUrl}
                        alt="current"
                        className="w-full h-40 object-cover rounded-lg border"
                      />
                    </a>
                    <a
                      href={existing.linkUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline break-all text-sm"
                    >
                      {existing.linkUrl}
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <ImagePlus className="w-4 h-4" />
                    No post in this slot yet
                  </div>
                )}

                {/* Replacement / Create form for this slot */}
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">
                      Link URL
                    </label>
                    <Input
                      placeholder="https://example.com/promo"
                      value={slot.linkUrl}
                      onChange={(e) => onLinkChange(idx, e.target.value)}
                      disabled={isBusy}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1 block">
                      Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onFileChange(idx, e.target.files?.[0])}
                      className="block w-full text-sm text-slate-700 border border-slate-200 rounded-lg p-2"
                      disabled={isBusy}
                    />
                    {slot.preview && (
                      <img
                        src={slot.preview}
                        alt="preview"
                        className="mt-2 w-full h-40 object-cover rounded-lg border"
                      />
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleReplaceOrCreate(idx)}
                      className="bg-blue-600"
                      disabled={isBusy}
                    >
                      {isBusy ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Saving…
                        </>
                      ) : existing ? (
                        "Replace Post"
                      ) : (
                        "Create Post"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManagePosts;
