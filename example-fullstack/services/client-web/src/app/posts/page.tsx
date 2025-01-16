"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PostModal from "../components/PostModal";
import Image from "next/image";

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
}

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleSave = async (
    postData: Pick<Post, "title" | "content" | "authorId">
  ) => {
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const newPost = await response.json();
        setPosts([...posts, newPost]);
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleUpdate = async (
    postData: Pick<Post, "title" | "content" | "authorId">
  ) => {
    if (!selectedPost) return;

    try {
      const response = await fetch(`/api/posts/${selectedPost.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(
          posts.map((p) => (p.id === selectedPost.id ? updatedPost : p))
        );
        setSelectedPost(null);
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Posts Dashboard
              </h1>
              <nav className="flex gap-6">
                <Link
                  href="/"
                  className="text-gray-500 font-medium hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Users
                </Link>
                <Link
                  href="/posts"
                  className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                  Posts
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                New Post
              </button>
              <Image
                className="dark:invert"
                src="/next.svg"
                alt="Next.js logo"
                width={100}
                height={20}
                priority
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {post.content}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>Author ID: {post.authorId}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedPost(post)}
                  className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <PostModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSave}
      />
      <PostModal
        post={selectedPost || undefined}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        onSave={handleUpdate}
      />
    </div>
  );
}
