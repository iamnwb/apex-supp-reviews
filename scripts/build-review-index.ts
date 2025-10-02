import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";
import { ReviewFrontmatterSchema, ReviewIndexEntrySchema } from "../src/mdx/reviewSchema.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, ".." );
const REVIEWS_DIR = path.join(ROOT, "src/content/reviews");
const OUTPUT_PATH = path.join(REVIEWS_DIR, "index.json");

const calculateReadingTime = (content: string) => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} min read`;
};

async function getMdxFiles() {
  const entries = await fs.readdir(REVIEWS_DIR, { withFileTypes: true });
  return entries.filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"));
}

async function buildIndex() {
  const files = await getMdxFiles();
  const reviews = [];

  for (const file of files) {
    const filePath = path.join(REVIEWS_DIR, file.name);
    const raw = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(raw);

    const parseResult = ReviewFrontmatterSchema.safeParse(data);
    if (!parseResult.success) {
      const formatted = parseResult.error.issues
        .map((issue) => ` - ${issue.path.join(".") || "frontmatter"}: ${issue.message}`)
        .join("\n");
      throw new Error(`Invalid review frontmatter in ${file.name}\n${formatted}`);
    }

    const frontmatter = parseResult.data;
    const slug = file.name.replace(/\.mdx$/, "");
    const readingTime = frontmatter.readingTime ?? calculateReadingTime(content);

    const reviewEntry = ReviewIndexEntrySchema.parse({
      slug,
      ...frontmatter,
      readingTime,
    });

    reviews.push(reviewEntry);
  }

  reviews.sort((a, b) => {
    const aDate = new Date(a.lastUpdated ?? 0).getTime();
    const bDate = new Date(b.lastUpdated ?? 0).getTime();
    return bDate - aDate;
  });

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(reviews, null, 2));
  console.log(`Indexed ${reviews.length} reviews to ${path.relative(ROOT, OUTPUT_PATH)}`);
}

buildIndex().catch((error) => {
  console.error("Failed to build review index:\n", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
