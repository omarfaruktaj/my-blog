"use server";

import { FormSchema } from "@/components/post-form";
import { revalidatePath } from "next/cache";

export async function createPost(values: FormSchema) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/posts`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create post");
  }

  revalidatePath("/");

  return { success: true };
}
