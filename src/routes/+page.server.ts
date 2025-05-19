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
        height: 300, // Default height, adjust if TOML provides dimensions
        width: 450, // Default width
    };
}

function transformTomlToFrontpageArticle(
    tomlArticle: TomlArticleWithSlug,
    customTopic?: FrontpageTopic,
): FrontpageArticle {
    const slug = tomlArticle.slug;
    const standfirst =
        tomlArticle.description || "No description available.";

    return {
        id: `art-${slug}`,
        title: tomlArticle.title || "Untitled Article",
        slug: slug,
        type: "article", // Default type
        audio: null, // Assuming no audio in TOMLs
        standfirstShort:
            standfirst.length > 150
                ? standfirst.substring(0, 147) + "..."
                : standfirst,
        standfirstLong: standfirst,
        duration: (tomlArticle.readingTime || 5) * 60, // Convert minutes to seconds
        creditsShort:
            tomlArticle.authors?.map((a) => a.name).join(", ") ||
            "Unknown Author",
        commentsEnabled: true, // Default
        settings: {
            badgeColor: null,
            cardPlayIconColor: "#333333",
            alignX: "left",
            alignY: "top",
            backdropStrength: 0.7,
        } as FrontpageSettings,
        tags: [] as FrontpageTag[], // No tags in current TOML structure
        authors: transformTomlAuthorsToFrontpageAuthors(
            tomlArticle.authors,
            slug,
        ),
        image: transformTomlImageToFrontpageImage(tomlArticle.image),
        primaryTopic: customTopic || {
            title: "General",
            slug: "general",
        } as FrontpageTopic,
        section: { slug: "articles" } as FrontpageSection,
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
        image: { // Ensure featured essay also has a standard image for consistency if needed elsewhere
            url: featuredImg.url, // Use the same image for consistency
            alt: featuredImg.alt,
            height: 450, // Typically larger for featured
            width: 800,
        },
        featuredImage: featuredImg,
    };
}

export const load: ServerLoad = async () => {
    const allTomlArticles = await getAllArticles();

    if (!allTomlArticles || allTomlArticles.length === 0) {
        console.warn(
            "No articles loaded from service for the front page. Returning empty data.",
        );
        // Return a default structure to prevent errors on the page
        const emptyFeatured: FrontpageFeaturedEssay = {
            id: "empty-featured", title: "No Articles Available", slug: "empty", type: "essay", audio: null, standfirstShort: "", standfirstLong: "", duration: 0, creditsShort: "", commentsEnabled: false, settings: {} as FrontpageSettings, tags: [], authors: [], image: {} as FrontpageImage, primaryTopic: {} as FrontpageTopic, section: {} as FrontpageSection, featuredImage: {} as FrontpageFeaturedImage
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

    // Define some topics for variety - these could also come from TOML if added
    const topicPhilosophy: FrontpageTopic = { title: "Philosophy", slug: "philosophy" };
    const topicTech: FrontpageTopic = { title: "Technology", slug: "technology" };
    const topicScience: FrontpageTopic = { title: "Science", slug: "science" };


    // Select featured essay (e.g., the one with slug 'new' or the first one)
    let featuredToml = allTomlArticles.find((a) => a.slug === "new");
    if (!featuredToml && allTomlArticles.length > 0) {
        featuredToml = allTomlArticles[0]; // Fallback to the first article
    }
    const featuredEssay = featuredToml ? transformTomlToFeaturedEssay(featuredToml, topicPhilosophy) : ({} as FrontpageFeaturedEssay); // Provide a default empty object if still nothing

    // Select popular articles (e.g., the next two, or specific slugs)
    const popularTomlArticles = allTomlArticles.filter(a => a.slug !== featuredToml?.slug).slice(0, 2);
    const popularThisMonth: FrontpageArticle[] = popularTomlArticles.map((toml, i) =>
        transformTomlToFrontpageArticle(toml, i % 2 === 0 ? topicTech : topicScience),
    );


    // Create the main grid of articles
    const gridArticlesToml = allTomlArticles.filter(a => a.slug !== featuredToml?.slug);
    const articlesForGrid: FrontpageArticle[] = [];
    const numGridArticles = 22; // Desired number of articles in the grid
    if (gridArticlesToml.length > 0) {
        for (let i = 0; i < numGridArticles; i++) {
            articlesForGrid.push(
                transformTomlToFrontpageArticle(
                    gridArticlesToml[i % gridArticlesToml.length], // Cycle through available articles
                    i % 3 === 0 ? topicScience : i % 3 === 1 ? topicTech : topicPhilosophy
                ),
            );
        }
    }


    // Select "more articles" (e.g., a couple different from popular/featured)
    const moreArticlesToml = allTomlArticles.filter(
        a => a.slug !== featuredToml?.slug && !popularTomlArticles.find(p => p.slug === a.slug)
    ).slice(0, 2);
    const moreArticlesNodes: FrontpageArticle[] = moreArticlesToml.map((toml) =>
        transformTomlToFrontpageArticle(toml, topicScience),
    );

    const latestArticlesData: LatestArticles = {
        featuredEssay: featuredEssay,
        popularThisMonth: popularThisMonth,
        articles: articlesForGrid,
        moreArticles: {
            nodes: moreArticlesNodes,
            pageInfo: {
                endCursor: moreArticlesNodes.length > 0 ? `cursor-end-${moreArticlesNodes.slice(-1)[0].slug}` : null,
                startCursor: moreArticlesNodes.length > 0 ? `cursor-start-${moreArticlesNodes[0].slug}` : null,
                hasNextPage: allTomlArticles.length > (1 + popularThisMonth.length + moreArticlesNodes.length), // Basic logic for hasNextPage
            },
        },
    };

    return {
        data: latestArticlesData,
    };
};
