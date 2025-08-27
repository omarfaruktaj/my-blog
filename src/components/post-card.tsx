import { BlogPost } from "@/types";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";
import Image from "next/image";

export default function PostCard({ post }: { post: BlogPost }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row">
        {post.image && (
          <div className="md:w-48 md:flex-shrink-0">
            <Image
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              height={100}
              width={100}
              className="w-full h-48 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
            />
          </div>
        )}
        <div className="flex-1">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">
                  <Link
                    href={`/posts/${post._id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  By {post.author} • {formatDate(post.createdAt)}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          {post.content && (
            <CardContent>
              <p className="text-muted-foreground leading-relaxed truncate">
                {post.content}
              </p>
              <Link
                href={`/posts/${post._id}`}
                className="inline-block mt-3 text-primary hover:underline font-medium"
              >
                Read more →
              </Link>
            </CardContent>
          )}
        </div>
      </div>
    </Card>
  );
}
