"use client";

import { useEffect, useState, useRef } from "react";
import API from "../../../services/api";

export default function SchedulePage() {
  const [caption, setCaption] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [image, setImage] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);

  // 🔔 PHASE 14: TOAST NOTIFICATION STATES
  const [notification, setNotification] = useState("");
  
  // Ref use karenge taaki fetchPosts hamesha latest posts state ko track kar sake bina loop fasaaye
  const postsRef = useRef<any[]>([]);
  useEffect(() => {
    postsRef.current = posts;
  }, [posts]);

  // 🟡 EDIT MODE STATES
  const [editingId, setEditingId] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // 🔔 PHASE 14: SHOW NOTIFICATION FUNCTION
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification("");
    }, 4000); // 4 second tak display hoga, fir automatic gayab
  };

  // 📌 GET ALL POSTS + ⚡ DETECT NEWLY PUBLISHED POSTS (FIXED)
  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newPosts = res.data;
      const oldPosts = postsRef.current;

      // Agar pehle se koi posts data pipeline mein hai, tabhi status change track karo
      if (oldPosts.length > 0) {
        newPosts.forEach((newPost: any) => {
          const oldPost = oldPosts.find((p) => p._id === newPost._id);

          // 🎯 Agar pehle status 'pending' tha aur ab 'published' ho gaya hai
          if (oldPost && oldPost.status !== newPost.status) {
            if (newPost.status === "published") {
              showNotification(`🚀 Your post "${newPost.caption?.slice(0, 20)}..." is now LIVE!`);
            }
          }
        });
      }

      setPosts(newPosts);
    } catch (error) {
      console.log("Fetch posts error:", error);
    }
  };

  // ⚡ AUTO REFRESH POLLING (Phase 13 Boost + Phase 14 Trigger)
  useEffect(() => {
    fetchPosts();

    const interval = setInterval(() => {
      fetchPosts();
    }, 5000); // Har 5 second mein backend se status check karega

    return () => clearInterval(interval);
  }, []);

  // 📌 CREATE / UPDATE POST
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const payload: any = {
        caption,
        scheduledTime,
      };

      if (editingId) {
        // UPDATE MODE
        await API.put(`/posts/${editingId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // CREATE MODE
        if (image) {
          const formData = new FormData();
          formData.append("caption", caption);
          formData.append("scheduledTime", scheduledTime);
          formData.append("image", image);

          await API.post("/posts", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
        } else {
          const awaitPost = await API.post("/posts", payload, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
      }

      // Reset Form
      setCaption("");
      setScheduledTime("");
      setImage(null);
      setEditingId(null);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      fetchPosts();
      alert(editingId ? "Post Updated 🚀" : "Post Scheduled 🚀");
    } catch (error) {
      console.log("Submit form error:", error);
    }
  };

  // 🗑️ DELETE
  const handleDelete = async (postId: string) => {
    if (!confirm("Delete this post?")) return;

    try {
      await API.delete(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
    } catch (error) {
      console.log("Delete post error:", error);
    }
  };

  // ✏️ EDIT
  const handleEdit = (post: any) => {
    setCaption(post.caption);
    if (post.scheduledTime) {
      setScheduledTime(new Date(post.scheduledTime).toISOString().slice(0, 16));
    } else {
      setScheduledTime("");
    }
    setImage(null);
    setEditingId(post._id);
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6 md:p-10 text-white relative">
      
      {/* 🔔 3. PREMIUM NOTIFICATION BANNER UI */}
      {notification && (
        <div className="fixed top-5 right-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl z-50 flex items-center gap-3 font-semibold border border-green-400/30 animate-bounce tracking-wide">
          <span className="text-xl">🔔</span>
          {notification}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-8">Content Scheduler 🚀</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white text-black p-6 rounded-xl space-y-4 h-fit sticky top-6 shadow-2xl"
        >
          <h2 className="text-lg font-bold border-b pb-2 text-gray-700">
            {editingId ? "Edit Scheduled Post ✏️" : "Create New Schedule 📅"}
          </h2>

          <textarea
            placeholder="Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full border p-3 rounded text-black focus:outline-blue-500"
            rows={4}
            required
          />

          <div>
            <label className="text-xs text-gray-500 block mb-1 font-semibold">
              Upload Banner/Image (Optional)
            </label>
            <input
              type="file"
              onChange={(e: any) => setImage(e.target.files[0])}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={!!editingId}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1 font-semibold">Scheduled Date & Time</label>
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full border p-3 rounded text-black focus:outline-blue-500"
              required
            />
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2.5 rounded font-bold transition-all">
            {editingId ? "Update Post" : "Schedule Post"}
          </button>
          
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setCaption("");
                setScheduledTime("");
                setImage(null);
                setEditingId(null);
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-full py-2 rounded font-semibold transition-all"
            >
              Cancel Edit
            </button>
          )}
        </form>

        {/* POSTS LIST */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold border-b border-gray-800 pb-2">Scheduled Queues ({posts.length})</h2>
          
          {posts.length === 0 ? (
            <p className="text-gray-500 italic">No posts scheduled yet.</p>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="bg-gray-900 border border-gray-800 p-4 rounded-lg flex flex-col justify-between hover:border-gray-700 transition-all">
                <div className="flex justify-between items-start gap-4">
                  <h2 className="text-lg font-medium break-words max-w-[80%]">{post.caption}</h2>
                  
                  <div className="flex gap-3 text-sm font-semibold shrink-0">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-800/50">
                  <p className="text-xs text-gray-400">
                    📅 {new Date(post.scheduledTime).toLocaleString()}
                  </p>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                    post.status === "published" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                  }`}>
                    {post.status || "pending"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}