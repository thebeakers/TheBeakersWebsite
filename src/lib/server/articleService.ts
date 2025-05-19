// src/lib/server/articleService.ts
import fs from "fs/promises";
import path from "path";
import { glob } from "glob";
import { parse } from "toml";
import type { Article as TomlArticle } from "$lib/types"; // Source TOML structure

export interface TomlArticleWithSlug extends TomlArticle {
    slug: string;
}

// In-memory cache for articles
let cachedArticles: TomlArticleWithSlug[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION_MS = 5 * 60 * 1000; // Cache for 5 minutes in production, or adjust as needed

// Resolve the articles directory path relative to the project root
const articlesDir = path.resolve(process.cwd(), "src", "articles");

async function readAndParseArticle(
    filePath: string,
): Promise<TomlArticleWithSlug | null> {
    try {
        const slug = path.parse(filePath).name;
        // Skip hidden or system files (e.g., .DS_Store) if glob somehow picks them up
        if (slug.startsWith(".")) {
            console.warn(`Skipping hidden or system file: ${filePath}`);
            return null;
        }
        const fileContent = await fs.readFile(filePath, "utf-8");
        const parsedData = parse(fileContent) as TomlArticle; // Assume TOML structure matches $lib/types.Article
        return { ...parsedData, slug };
    } catch (error) {
        console.error(
            `Error reading or parsing article ${filePath}:`,
            error,
        );
        return null;
    }
}

export async function getAllArticles(
    forceRefresh: boolean = false,
): Promise<TomlArticleWithSlug[]> {
    const now = Date.now();
    const isCacheExpired =
        cacheTimestamp === null || now - cacheTimestamp > CACHE_DURATION_MS;

    // In development, always refresh if forceRefresh is not explicitly false
    // In production (or if dev is false), rely on cache duration
    const shouldRefresh =
        process.env.NODE_ENV === "development"
            ? forceRefresh || cachedArticles === null
            : forceRefresh || cachedArticles === null || isCacheExpired;

    if (cachedArticles && !shouldRefresh) {
        console.log("Returning cached articles.");
        return cachedArticles;
    }

    console.log(
        shouldRefresh ? "Refreshing article cache." : "Fetching articles...",
    );

    try {
        const files = await glob("*.toml", {
            cwd: articlesDir,
            dot: false, // Explicitly ignore dotfiles
            nodir: true, // Ensure only files are matched
        });

        if (files.length === 0) {
            console.warn(
                `No .toml files found in ${articlesDir}. Check the path and file extensions.`,
            );
            cachedArticles = [];
            cacheTimestamp = now;
            return [];
        }

        const articlePromises = files.map((file) =>
            readAndParseArticle(path.join(articlesDir, file)),
        );

        const settledArticles = await Promise.all(articlePromises);

        const uniqueArticlesMap = new Map<string, TomlArticleWithSlug>();
        for (const article of settledArticles) {
            if (article && article.slug) {
                if (!uniqueArticlesMap.has(article.slug)) {
                    uniqueArticlesMap.set(article.slug, article);
                } else {
                    console.warn(
                        `Duplicate slug found: ${article.slug}. Keeping the first one encountered.`,
                    );
                }
            }
        }
        cachedArticles = Array.from(uniqueArticlesMap.values());
        cacheTimestamp = now;
        console.log(
            `Successfully fetched and cached ${cachedArticles.length} articles.`,
        );
        return cachedArticles;
    } catch (error) {
        console.error("Failed to get all articles:", error);
        // Don't poison the cache with an empty array if there was a general error during glob or Promise.all
        // but if it was empty from the start, that's fine.
        if (cachedArticles === null) {
            cachedArticles = [];
        }
        // cacheTimestamp will not be updated, so next attempt will try to refresh
        return cachedArticles; // Return existing cache or empty array
    }
}

export function clearArticleCache(): void {
    cachedArticles = null;
    cacheTimestamp = null;
    console.log("Article cache cleared.");
}

export async function getArticleBySlug(
    slug: string,
): Promise<TomlArticleWithSlug | undefined> {
    const articles = await getAllArticles();
    return articles.find((article) => article.slug === slug);
}

// NEW FUNCTION
export async function getArticlesByCategory(
    category: string,
    forceRefresh: boolean = false,
): Promise<TomlArticleWithSlug[]> {
    const allArticles = await getAllArticles(forceRefresh);
    // Article category is now mandatory, so article.category will always exist.
    // The ?. is kept for safety but technically not needed if types are strictly followed.
    return allArticles.filter(
        (article) => article.category?.toLowerCase() === category.toLowerCase(),
    );
}
