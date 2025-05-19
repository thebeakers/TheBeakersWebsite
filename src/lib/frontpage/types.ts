// src/lib/frontpage/types.ts

// This file now ONLY contains TypeScript interface definitions.
// All data generation and dummy data has been removed and is handled
// by src/routes/+page.server.ts using src/lib/server/articleService.ts.

export interface Data {
    latestArticles: LatestArticles;
}

// Props interface might be used by SvelteKit if you have specific page props
// For now, it's kept as it was, but might not be directly used by +page.server.ts's return.
export interface Props {
    pageProps: PageProps;
    preview: boolean;
    geolocation: string;
}

export interface PageProps {
    latestArticles: LatestArticles;
}

export interface LatestArticles {
    featuredEssay: FeaturedEssay;
    popularThisMonth: Article[];
    articles: Article[];
    moreArticles: MoreArticles;
}

export interface MoreArticles {
    nodes: Article[];
    pageInfo: PageInfo;
}

export interface PageInfo {
    endCursor: string | null;
    startCursor: string | null;
    hasNextPage: boolean;
}

export interface Article {
    id: string;
    title: string;
    slug: string;
    type: string; // e.g., 'article', 'video', 'essay'
    audio: string | null; // URL to audio file or null
    standfirstShort: string;
    standfirstLong: string;
    duration: number; // e.g., reading time in seconds or video duration
    creditsShort: string | null; // e.g., "By John Doe"
    commentsEnabled: boolean;
    settings: Settings;
    tags: Tag[];
    authors: Author[];
    image: Image; // Main card image
    primaryTopic: Topic;
    section: Section;
    featuredImage?: FeaturedImage; // Optional: for items that can be featured with a larger/different image
}

export interface FeaturedEssay extends Article {
    featuredImage: FeaturedImage; // Mandatory for FeaturedEssay
}

export interface Settings {
    badgeColor: string | null;
    cardPlayIconColor: string | null; // For video/audio cards
    alignX: "left" | "center" | "right"; // Image alignment for featured content
    alignY: "top" | "center" | "bottom";
    backdropStrength: number; // For text overlay on images
}

export interface Tag {
    name: string;
}

export interface Author {
    id: string;
    name: string;
}

export interface Image {
    url: string;
    alt: string;
    height: number;
    width: number;
}

export interface FeaturedImage {
    url: string;
    caption: string;
    alt: string;
}

export interface Topic {
    title: string;
    slug: string;
}

export interface Section {
    slug: string; // e.g., 'philosophy', 'science'
}
