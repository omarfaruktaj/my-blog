"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { createPost } from "@/actions/createPost";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImageIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

// ✅ Schema
const formSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must be at most 100 characters long")
    .trim(),

  content: z
    .string()
    .min(10, "Content must be at least 10 characters long")
    .max(5000, "Content must be at most 5000 characters long")
    .trim(),

  image: z
    .union([z.string().url(), z.literal(""), z.undefined()])
    .transform((val) => (val === "" ? undefined : val)),

  author: z
    .string()
    .min(2, "Author name must be at least 2 characters long")
    .max(50, "Author name must be at most 50 characters long")
    .trim(),
});

interface CreatePostFormProps {
  onSuccess?: () => void;
}

export type FormSchema = z.infer<typeof formSchema>;

export default function PostForm({ onSuccess }: CreatePostFormProps) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      author: "",
      image: undefined,
    },
  });

  // ✅ Upload handler
  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        setImageUrl(data.secure_url);
        form.setValue("image", data.secure_url);
        toast("Image uploaded", {
          description: "Uploaded to Cloudinary successfully.",
        });
      } else {
        toast("Upload failed", {
          description: "Cloudinary did not return a secure URL.",
        });
      }
    } catch (err) {
      toast("Upload error", {
        description: "Something went wrong while uploading image.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImageUrl(undefined);
    form.setValue("image", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // async function onSubmit(values: FormSchema) {
  //   try {
  //     const response = await fetch(
  //       `${
  //         process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"
  //       }/api/v1/posts`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           title: values.title,
  //           content: values.content.trim(),
  //           image: values.image,
  //           author: values.author,
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to create post");
  //     }
  //     revalidatePath("/");

  //     toast.success("Your blog post has been created successfully.");
  //   } catch (error) {
  //     console.error("Error creating post:", error);
  //     toast.error("Something Went wrong!", {
  //       description: "Failed to create the blog post. Please try again.",
  //     });
  //   }
  //   onSuccess?.();
  // }
  const onSubmit = async (values: FormSchema) => {
    try {
      await createPost(values);
      toast.success("Post created successfully.");
      onSuccess?.();
    } catch (err) {
      toast.error("Failed to create post");
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your post title..."
                  className="text-lg"
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Author */}
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter author name..."
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Content */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content *</FormLabel>
              <FormControl>
                <textarea
                  placeholder="Write your post content here..."
                  className="resize-none w-full h-40 p-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can use Markdown formatting in your content.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Upload */}
        <FormItem>
          <FormLabel>Featured Image</FormLabel>
          <FormControl>
            <div className="space-y-4">
              {!imageUrl ? (
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-primary transition"
                >
                  <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload image
                  </span>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(file);
                      }
                    }}
                  />
                </label>
              ) : (
                <div className="relative group overflow-hidden rounded-lg">
                  <Image
                    src={imageUrl}
                    alt="Uploaded preview"
                    width={600}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={removeImage}
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </FormControl>
          {/* <FormDescription>
            JPEG, PNG, or WEBP. Max file size ~5MB.
          </FormDescription> */}
        </FormItem>

        {/* Submit */}
        <div className="flex items-center gap-4 pt-4">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || isUploading}
          >
            {form.formState.isSubmitting || isUploading
              ? "Creating..."
              : "Create Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
