// src/routes/+page.server.ts
import type { ServerLoad } from "@sveltejs/kit";
import {
    getAllArticles,
    type TomlArticleWithSlug,
} from "$lib/server/articleService";
import type {
    LatestArticles,
    Article as FrontpageArticle,
    FeaturedEssay as FrontpageFeaturedEssay,
    Author as FrontpageAuthor,
    Image as FrontpageImage,
    FeaturedImage as FrontpageFeaturedImage,
    Topic as FrontpageTopic,
    Section as FrontpageSection,
    Settings as FrontpageSettings,
    Tag as FrontpageTag,
} from "$lib/frontpage/types"; // Structures for the front page
import type {
    Author as TomlAuthorType,
    Image as TomlImageType,
} from "$lib/types"; // Original TOML types for clarity

// --- Transformation Functions (Consider refactoring to a shared utility) ---
function transformTomlAuthorsToFrontpageAuthors(
    tomlAuthors: TomlAuthorType[] | undefined,
    articleSlug: string,
): FrontpageAuthor[] {
    if (!tomlAuthors || tomlAuthors.length === 0) {
        return [{ id: `author-${articleSlug}-unknown`, name: "Unknown Author" }];
    }
    return tomlAuthors.map((author, index) => ({
        id: `author-${articleSlug}-${author.slug || index}`,
        name: author.name || "Unnamed Author",
    }));
}

function transformTomlImageToFrontpageImage(
    tomlImage: TomlImageType | undefined,
): FrontpageImage {
    if (!tomlImage || !tomlImage.url) {
        return {
            url: "https://placehold.co/450x300/EEE/AAA?text=No+Image",
            alt: "Placeholder image",
            height: 300,
            width: 450,
        };
    }
    return {
        url: tomlImage.url,
        alt: tomlImage.alt || "Article image",
        height: 300,
        width: 450,
    };
}

function transformTomlToFrontpageArticle(
    tomlArticle: TomlArticleWithSlug,
    customTopic?: FrontpageTopic, // customTopic takes precedence for homepage logic
): FrontpageArticle {
    const slug = tomlArticle.slug;
    const standfirst =
        tomlArticle.description || "No description available.";

    // Determine topic: use customTopic if provided, otherwise derive from article's category
    const effectiveTopic: FrontpageTopic = customTopic || {
        title: tomlArticle.category.charAt(0).toUpperCase() + tomlArticle.category.slice(1),
        slug: tomlArticle.category.toLowerCase(),
    };

    return {
        id: `art-${slug}`,
        title: tomlArticle.title || "Untitled Article",
        slug: slug,
        type: "article",
        audio: null,
        standfirstShort:
            standfirst.length > 150
                ? standfirst.substring(0, 147) + "..."
                : standfirst,
        standfirstLong: standfirst,
        duration: (tomlArticle.readingTime || 5) * 60,
        creditsShort:
            tomlArticle.authors?.map((a) => a.name).join(", ") ||
            "Unknown Author",
        commentsEnabled: true,
        settings: {
            badgeColor: null,
            cardPlayIconColor: "#333333",
            alignX: "left",
            alignY: "top",
            backdropStrength: 0.7,
        } as FrontpageSettings,
        tags: [] as FrontpageTag[],
        authors: transformTomlAuthorsToFrontpageAuthors(
            tomlArticle.authors,
            slug,
        ),
        image: transformTomlImageToFrontpageImage(tomlArticle.image),
        primaryTopic: effectiveTopic,
        section: { slug: effectiveTopic.slug } as FrontpageSection,
    };
}

function transformTomlToFeaturedEssay(
    tomlArticle: TomlArticleWithSlug,
    customTopic?: FrontpageTopic,
): FrontpageFeaturedEssay {
    const baseArticle = transformTomlToFrontpageArticle(
        tomlArticle,
        customTopic,
    );
    const featuredImg: FrontpageFeaturedImage = tomlArticle.image
        ? {
            url: tomlArticle.image.url,
            caption: tomlArticle.image.caption || "",
            alt: tomlArticle.image.alt || "Featured image",
        }
        : {
            url: "https://placehold.co/800x450/EEE/AAA?text=No+Featured+Image",
            caption: "Placeholder",
            alt: "Placeholder featured image",
        };

    return {
        ...baseArticle,
        type: "essay",
        image: {
            url: featuredImg.url,
            alt: featuredImg.alt,
            height: 300,
            width: 450,
        },
        featuredImage: featuredImg,
    };
}
// --- End Transformation Functions ---

export const load: ServerLoad = async () => {
    const allTomlArticles = await getAllArticles();

    if (!allTomlArticles || allTomlArticles.length === 0) {
        console.warn(
            "No articles loaded from service for the front page. Returning empty data.",
        );
        const emptyFeatured: FrontpageFeaturedEssay = {
            id: "empty-featured", title: "No Articles Available", slug: "empty", type: "essay", audio: null, standfirstShort: "", standfirstLong: "", duration: 0, creditsShort: "", commentsEnabled: false, settings: {} as FrontpageSettings, tags: [], authors: [], image: {} as FrontpageImage, primaryTopic: { title: "General", slug: "general" } as FrontpageTopic, section: { slug: "general" } as FrontpageSection, featuredImage: {} as FrontpageFeaturedImage
        };
        return {
            data: {
                featuredEssay: emptyFeatured,
                popularThisMonth: [],
                articles: [],
                moreArticles: {
                    nodes: [],
                    pageInfo: {
                        endCursor: null,
                        startCursor: null,
                        hasNextPage: false,
                    },
                },
            } as LatestArticles,
        };
    }

    // Define topics for homepage cycling if needed, or use article's own category
    const topicPhilosophy: FrontpageTopic = { title: "Philosophy", slug: "philosophy" };
    const topicTech: FrontpageTopic = { title: "Technology", slug: "technology" };
    const topicScience: FrontpageTopic = { title: "Science", slug: "science" };

    // 1. Select Featured Essay
    let featuredToml = allTomlArticles.find((a) => a.slug === "new"); // Prioritize 'new'
    if (!featuredToml) { // Fallback if 'new' isn't found
        featuredToml = allTomlArticles.find(a => a.slug !== 'default' && a.slug !== 'fake' && a.category !== 'general');
    }
    if (!featuredToml && allTomlArticles.length > 0) { // Broader fallback
        featuredToml = allTomlArticles.find(a => a.slug !== 'default' && a.slug !== 'fake');
    }
    if (!featuredToml && allTomlArticles.length > 0) { // Last resort
        featuredToml = allTomlArticles[0];
    }


    const featuredEssay = featuredToml
        ? transformTomlToFeaturedEssay(featuredToml, featuredToml.category === "biology" ? { title: "Biology", slug: "biology" } : topicPhilosophy) // Example: assign a specific topic or derive
        : ({} as FrontpageFeaturedEssay); // Fallback if no articles at all

    // 2. Populate the main grid with ALL articles
    //    Assign topics cyclically for variety in the grid, or use article's own category
    const articlesForGrid: FrontpageArticle[] = allTomlArticles
        .filter(article => article.slug !== featuredToml?.slug) // Avoid duplicating featured in grid
        .map((tomlArticle, index) => {
            // Example of cyclical topic assignment for homepage variety
            // let topic = topicPhilosophy;
            // if (index % 3 === 0) topic = topicScience;
            // else if (index % 3 === 1) topic = topicTech;
            // return transformTomlToFrontpageArticle(tomlArticle, topic);

            // Or, use the article's own category as its topic for the homepage grid
            return transformTomlToFrontpageArticle(tomlArticle);
        });

    const latestArticlesData: LatestArticles = {
        featuredEssay: featuredEssay,
        popularThisMonth: [],
        articles: articlesForGrid,
        moreArticles: {
            nodes: [],
            pageInfo: {
                endCursor: null,
                startCursor: null,
                hasNextPage: false,
            },
        },
    };

    return {
        data: latestArticlesData,
    };
};
