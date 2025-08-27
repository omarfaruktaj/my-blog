import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDate } from "@/utils/formatDate";
import { ArrowLeftIcon, CalendarIcon, ClockIcon, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
function formatReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readingTime} min read`;
}

function formatContent(content: string): string {
  return content
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0)
    .map((paragraph) => {
      // Handle headers
      if (paragraph.startsWith("## ")) {
        return `<h2 class="text-2xl font-semibold mt-8 mb-4 text-foreground">${paragraph.slice(
          3
        )}</h2>`;
      }
      if (paragraph.startsWith("# ")) {
        return `<h1 class="text-3xl font-bold mt-8 mb-4 text-foreground">${paragraph.slice(
          2
        )}</h1>`;
      }

      // Handle bold text
      paragraph = paragraph.replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="font-semibold">$1</strong>'
      );

      // Handle lists
      if (paragraph.includes("\n- ") || paragraph.includes("\n• ")) {
        const items = paragraph
          .split("\n")
          .filter(
            (line) =>
              line.trim().startsWith("- ") || line.trim().startsWith("• ")
          );
        if (items.length > 0) {
          const listItems = items
            .map(
              (item) => `<li class="mb-2">${item.replace(/^[•-]\s*/, "")}</li>`
            )
            .join("");
          return `<ul class="list-disc list-inside space-y-2 my-4">${listItems}</ul>`;
        }
      }

      // Handle numbered lists
      if (/^\d+\./.test(paragraph.trim())) {
        const items = paragraph
          .split("\n")
          .filter((line) => /^\d+\./.test(line.trim()));
        if (items.length > 0) {
          const listItems = items
            .map(
              (item) => `<li class="mb-2">${item.replace(/^\d+\.\s*/, "")}</li>`
            )
            .join("");
          return `<ol class="list-decimal list-inside space-y-2 my-4">${listItems}</ol>`;
        }
      }

      // Regular paragraphs
      return `<p class="mb-4 leading-relaxed">${paragraph}</p>`;
    })
    .join("");
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/api/v1/posts/${id}`,
    {
      cache: "no-store",
    }
  );
  const data = await response.json();

  const post = data.data;
  const formattedContent = formatContent(post.content);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Posts
          </Link>
        </div>

        <article>
          <Card>
            <CardHeader className="pb-6">
              <h1 className="text-4xl font-bold text-foreground leading-tight mb-4">
                {post.title}
              </h1>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4" />
                  <span>{formatReadingTime(post.content)}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {post.image && (
                <div className="mb-8">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    height={500}
                    width={500}
                    alt={post.title}
                    className="w-full h-64 md:h-80 object-cover rounded-lg"
                  />
                </div>
              )}

              <div
                className="prose prose-lg max-w-none text-foreground"
                dangerouslySetInnerHTML={{ __html: formattedContent }}
              />
            </CardContent>
          </Card>
        </article>
      </div>
    </div>
  );
}
