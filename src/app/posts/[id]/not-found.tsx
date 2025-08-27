import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileQuestionIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <FileQuestionIcon className="h-16 w-16 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">Post Not Found</CardTitle>
            <CardDescription>
              The blog post you&apos;re looking for doesn&apos;t exist or may
              have been removed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button>Back to All Posts</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
