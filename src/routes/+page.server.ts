// +page.server.ts (or +layout.server.ts)
import type { ServerLoad } from '@sveltejs/kit';
import { latestArticles } from '$lib/frontpage/types';

export const load = (async () => {
    return {
        data: latestArticles.latestArticles,
    };
}) satisfies ServerLoad;
