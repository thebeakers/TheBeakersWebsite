export interface Data {
    latestArticles: LatestArticles;
}

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
    type: string;
    audio: string | null;
    standfirstShort: string;
    standfirstLong: string;
    duration: number;
    creditsShort: string | null;
    commentsEnabled: boolean;
    settings: Settings;
    tags: Tag[];
    authors: Author[];
    image: Image;
    primaryTopic: Topic;
    section: Section;
    // Some articles (like the featured essay) include an extra
    // featuredImage property.
    featuredImage?: FeaturedImage;
}

export interface FeaturedEssay extends Article {
    featuredImage: FeaturedImage;
}

export interface Settings {
    badgeColor: string | null;
    cardPlayIconColor: string | null;
    alignX: "left" | "center" | "right";
    alignY: "top" | "center" | "bottom";
    backdropStrength: number;
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
    slug: string;
}


// dummyData.ts

// Dummy data for a FeaturedEssay (which extends Article)
const dummyFeaturedEssay: FeaturedEssay = {
    id: "fe-001",
    title: "The Depths of Dummy Thought",
    slug: "the-depths-of-dummy-thought",
    type: "essay",
    audio: null,
    standfirstShort: "A short introduction to our featured dummy essay.",
    standfirstLong:
        "This dummy essay explores the fascinating corners of abstract thought and serves as example content for our application.",
    duration: 420,
    creditsShort: "By John Doe",
    commentsEnabled: true,
    settings: {
        badgeColor: "#FF5733",
        cardPlayIconColor: "#333333",
        alignX: "center",
        alignY: "top",
        backdropStrength: 0.8,
    },
    tags: [{ name: "deep" }, { name: "featured" }],
    authors: [{ id: "author1", name: "John Doe" }],
    image: {
        url: "/cats/cat.10060.jpg", // using placeholder image
        alt: "Featured Essay Image Placeholder",
        height: 400,
        width: 600,
    },
    primaryTopic: {
        title: "Philosophy",
        slug: "philosophy",
    },
    section: {
        slug: "essays",
    },
    featuredImage: {
        url: "/cats/cat.10060.jpg", // placeholder for featured image
        caption: "Featured image caption",
        alt: "Dummy Essay Featured Image Placeholder",
    },
};

// Dummy data for a regular Article
const dummyArticle1: Article = {
    id: "art-001",
    title: "Dummy Article One",
    slug: "default",
    type: "article",
    audio: null,
    standfirstShort: "A short summary for dummy article one.",
    standfirstLong:
        "Detailed insight into the importance of dummy articles in testing and development.",
    duration: 300,
    creditsShort: "By Jane Smith",
    commentsEnabled: true,
    settings: {
        badgeColor: "#00AEEF",
        cardPlayIconColor: "#FFAA00",
        alignX: "left",
        alignY: "top",
        backdropStrength: 0.6,
    },
    tags: [{ name: "dummy" }, { name: "article" }],
    authors: [{ id: "author2", name: "Jane Smith" }],
    image: {
        url: "/cats/cat.2178.jpg", // placeholder image for article 1
        alt: "Dummy Article One Image Placeholder",
        height: 350,
        width: 550,
    },
    primaryTopic: {
        title: "Culture",
        slug: "culture",
    },
    section: {
        slug: "articles",
    },
};

const dummyArticle2: Article = {
    id: "art-002",
    title: "Dummy Article Two",
    slug: "dummy-article-two",
    type: "article",
    audio: "https://placeholder.pics/svg/540x360?text=Audio", // using placeholder for audio thumbnail
    standfirstShort: "A concise introduction to dummy article two.",
    standfirstLong:
        "This article dives deeper into the dummy ecosystem and provides comprehensive details that are useful during testing.",
    duration: 360,
    creditsShort: "By Alice Baker",
    commentsEnabled: false,
    settings: {
        badgeColor: "#00FF00",
        cardPlayIconColor: "#0000FF",
        alignX: "right",
        alignY: "bottom",
        backdropStrength: 0.4,
    },
    tags: [{ name: "testing" }, { name: "dummy" }],
    authors: [{ id: "author3", name: "Alice Baker" }],
    image: {
        url: "/cats/cat.2178.jpg", // placeholder image for article 1
        alt: "Dummy Article Two Image Placeholder",
        height: 360,
        width: 540,
    },
    primaryTopic: {
        title: "Technology",
        slug: "technology",
    },
    section: {
        slug: "articles",
    },
};

// Dummy data for MoreArticles containing an array of Articles and pagination info.
const dummyMoreArticles: MoreArticles = {
    nodes: [dummyArticle2],
    pageInfo: {
        startCursor: "cursor-start-001",
        endCursor: "cursor-end-001",
        hasNextPage: true,
    },
};

// Assemble the LatestArticles dummy data
const dummyLatestArticles: LatestArticles = {
    featuredEssay: dummyFeaturedEssay,
    popularThisMonth: [dummyArticle1, dummyArticle2],
    articles: [dummyArticle1, dummyArticle1, dummyArticle1, dummyArticle1, dummyArticle1, dummyArticle1, dummyArticle1, dummyArticle1, dummyArticle1, dummyArticle1, dummyArticle1, dummyArticle1, dummyArticle1, dummyArticle1, dummyArticle1, dummyArticle1, dummyArticle1, dummyArticle1, dummyArticle1, dummyArticle1, dummyArticle1, dummyArticle1],
    moreArticles: dummyMoreArticles,
};

// Finally, export the complete NextData dummy data
export const latestArticles: Data = {
    latestArticles: dummyLatestArticles,
};
