import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { getSurahs, getHadithBooks, getHadithBook, getAdhkarCategories } from '@/lib/data';
import { prophetsStories } from '@/data/stories/prophets';
import { quranStories } from '@/data/stories/quran';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: `${SITE_URL}/`, changeFrequency: 'daily', priority: 1 },
        { url: `${SITE_URL}/quran`, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${SITE_URL}/quran/juz`, changeFrequency: 'weekly', priority: 0.6 },
        { url: `${SITE_URL}/hadith`, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${SITE_URL}/adhkar`, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${SITE_URL}/prayer`, changeFrequency: 'daily', priority: 0.8 },
        { url: `${SITE_URL}/stories`, changeFrequency: 'weekly', priority: 0.7 },
        { url: `${SITE_URL}/stories/prophets`, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${SITE_URL}/stories/quran`, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${SITE_URL}/learn`, changeFrequency: 'weekly', priority: 0.7 },
        { url: `${SITE_URL}/learn/new-muslim`, changeFrequency: 'weekly', priority: 0.7 },
        { url: `${SITE_URL}/learn/kids`, changeFrequency: 'weekly', priority: 0.7 },
        { url: `${SITE_URL}/chat`, changeFrequency: 'monthly', priority: 0.5 },
        { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.4 },
    ];

    const surahs = await getSurahs();
    const quranRoutes: MetadataRoute.Sitemap = surahs.map((surah) => ({
        url: `${SITE_URL}/quran/${surah.index}`,
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    const books = await getHadithBooks();
    const hadithRoutes: MetadataRoute.Sitemap = [];
    for (const book of books) {
        hadithRoutes.push({
            url: `${SITE_URL}/hadith/${book.filename}`,
            changeFrequency: 'weekly',
            priority: 0.7,
        });
        try {
            const bookData = await getHadithBook(book.filename);
            for (const chapter of bookData.chapters) {
                hadithRoutes.push({
                    url: `${SITE_URL}/hadith/${book.filename}/${chapter.id}`,
                    changeFrequency: 'monthly',
                    priority: 0.4,
                });
            }
        } catch {
            // skip chapters if the book file is unavailable
        }
    }

    const adhkarCategories = await getAdhkarCategories();
    const adhkarRoutes: MetadataRoute.Sitemap = adhkarCategories.map((category) => ({
        url: `${SITE_URL}/adhkar/${category.filename}`,
        changeFrequency: 'weekly',
        priority: 0.6,
    }));

    const prophetRoutes: MetadataRoute.Sitemap = prophetsStories.map((prophet) => ({
        url: `${SITE_URL}/stories/prophets/${prophet.id}`,
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    const storyRoutes: MetadataRoute.Sitemap = quranStories.map((story) => ({
        url: `${SITE_URL}/stories/quran/${story.id}`,
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    return [
        ...staticRoutes,
        ...quranRoutes,
        ...hadithRoutes,
        ...adhkarRoutes,
        ...prophetRoutes,
        ...storyRoutes,
    ];
}