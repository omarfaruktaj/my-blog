import CreatePostDialog from "@/components/create-post-dialog";
import PostCard from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { BlogPost } from "@/types";

export default async function Home() {
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"
    }/api/v1/posts`,
    {
      cache: "no-store",
    }
  );

  const data = await response.json();

  const posts = data.data as BlogPost[];
  console.log(posts);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">My Blog</h1>
            <p className="text-muted-foreground text-lg">
              Thoughts, stories, and ideas from my journey
            </p>
          </div>
          <CreatePostDialog />
        </div>
        <div className="my-4">
          <Separator />
        </div>
        {/* Posts List */}
        {!posts || posts?.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
              No posts yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Get started by creating your first blog post.
            </p>
            <CreatePostDialog>
              <Button>Create Your First Post</Button>
            </CreatePostDialog>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard post={post} key={post._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
