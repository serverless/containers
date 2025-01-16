"use client";

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
}

interface PostModalProps {
  post?: Post;
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: Pick<Post, "title" | "content" | "authorId">) => void;
}

export default function PostModal({
  post,
  isOpen,
  onClose,
  onSave,
}: PostModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const postData = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      authorId: parseInt(formData.get("authorId") as string),
    };
    onSave(postData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {post ? "Edit Post" : "Create New Post"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={post?.title}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              defaultValue={post?.content}
              required
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="authorId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Author ID
            </label>
            <input
              type="number"
              id="authorId"
              name="authorId"
              defaultValue={post?.authorId}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {post ? "Save Changes" : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
