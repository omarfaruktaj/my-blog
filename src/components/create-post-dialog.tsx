"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import PostForm from "./post-form";

export default function CreatePostDialog({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            New Post
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Share your thoughts with the world
          </DialogDescription>
        </DialogHeader>
        <PostForm onSuccess={() => setIsDialogOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
