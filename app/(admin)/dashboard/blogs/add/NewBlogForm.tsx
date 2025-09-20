"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import MenuBar from "./MenuBar";
import { generateSlug } from "@/utils/generateSlug";
import { toast } from "react-toastify";
import { baseUrl } from "@/utils/baseUrl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/loaders/LoadingButton";
import { useRouter } from "next/navigation";

interface BlogFormData {
  title: string;
  slug: string;
  coverImage: string;
}

export default function NewBlogForm() {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { register, handleSubmit, setValue, watch, reset } =
    useForm<BlogFormData>({
      defaultValues: { title: "", slug: "", coverImage: "" },
    });

  const title = watch("title");
  useEffect(() => {
    if (title) setValue("slug", generateSlug(title));
  }, [title, setValue]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 hover:text-blue-700 underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none p-4 min-h-[300px]",
      },
    },
  });

  const onSubmit = async (data: BlogFormData) => {
    if (!content) {
      toast.error("Content is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${baseUrl}/api/blog/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          content,
          coverImage: data.coverImage || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create blog post");
      }

      toast.success("Blog post created successfully!");
      router.push("/dashboard/blogs");
      reset();
      editor?.commands.setContent("");
      setContent("");
    } catch (error: any) {
      console.error("Error creating blog post:", error);
      toast.error(error.message || "Failed to create blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Create New Blog Post
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            Title
          </label>
          <Input
            {...register("title", { required: true })}
            type="text"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter blog title"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            Cover Image URL
          </label>
          <Input
            {...register("coverImage")}
            type="text"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Rich Text Editor */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            Content
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <MenuBar editor={editor} />
            <div className="border-t border-gray-200">
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>

        <LoadingButton loading={isSubmitting}>Save Blog</LoadingButton>
      </form>
    </div>
  );
}
