// src/routes/biology/+page.server.ts
import type { ServerLoad } from "@sveltejs/kit";
import {
    getArticlesByCategory,
    type TomlArticleWithSlug,
} from "$lib/server/articleService";
import type {
    Article as FrontpageArticle,
    FeaturedEssay as FrontpageFeaturedEssay,
    Author as FrontpageAuthor,
    Image as FrontpageImage,
    FeaturedImage as FrontpageFeaturedImage,
    Topic as FrontpageTopic,
    Section as FrontpageSection,
    Settings as FrontpageSettings,
    Tag as FrontpageTag,
} from "$lib/frontpage/types";
import type {
    Author as TomlAuthorType,
    Image as TomlImageType,
} from "$lib/types";

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
    customTopic?: FrontpageTopic,
): FrontpageArticle {
    const slug = tomlArticle.slug;
    const standfirst =
        tomlArticle.description || "No description available.";
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
        primaryTopic: customTopic || {
            title: tomlArticle.category.charAt(0).toUpperCase() + tomlArticle.category.slice(1), // Use actual category
            slug: tomlArticle.category.toLowerCase(),
        } as FrontpageTopic,
        section: { slug: customTopic?.slug || tomlArticle.category.toLowerCase() } as FrontpageSection,
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
    const categoryName = "biology";
    const pageTitle = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    const categoryTomlArticles = await getArticlesByCategory(categoryName);

    const topicCategory: FrontpageTopic = { title: pageTitle, slug: categoryName };

    if (!categoryTomlArticles || categoryTomlArticles.length === 0) {
        const emptyFeatured: FrontpageFeaturedEssay = {
            id: `empty-featured-${categoryName}`,
            title: `No Articles in ${pageTitle}`,
            slug: "empty", type: "essay", audio: null, standfirstShort: `Discoveries in ${pageTitle} will appear here soon.`, standfirstLong: `There are currently no articles available in the ${pageTitle} category. Please check back later for exciting content!`, duration: 0, creditsShort: "", commentsEnabled: false, settings: {} as FrontpageSettings, tags: [], authors: [],
            image: { url: "https://placehold.co/450x300/EEE/AAA?text=Coming+Soon", alt: `${pageTitle} Coming Soon`, height: 300, width: 450 } as FrontpageImage,
            primaryTopic: topicCategory,
            section: { slug: categoryName } as FrontpageSection,
            featuredImage: { url: "https://placehold.co/800x450/EEE/AAA?text=Coming+Soon", alt: `${pageTitle} Coming Soon`, caption: "" } as FrontpageFeaturedImage
        };
        return {
            pageTitle: pageTitle,
            featuredEssay: emptyFeatured,
            articles: [],
        };
    }

    let featuredToml = categoryTomlArticles.find(a => a.slug !== 'default' && a.slug !== 'fake');
    if (!featuredToml && categoryTomlArticles.length > 0) {
        featuredToml = categoryTomlArticles[0];
    }

    const featuredEssayForCategory = featuredToml
        ? transformTomlToFeaturedEssay(featuredToml, topicCategory)
        : ({} as FrontpageFeaturedEssay);

    const articlesForCategoryGrid: FrontpageArticle[] = categoryTomlArticles
        .filter(article => article.slug !== featuredToml?.slug)
        .map(tomlArticle => transformTomlToFrontpageArticle(tomlArticle, topicCategory));

    return {
        pageTitle: pageTitle,
        featuredEssay: featuredEssayForCategory,
        articles: articlesForCategoryGrid,
    };
};
