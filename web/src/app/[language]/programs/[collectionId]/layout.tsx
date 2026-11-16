import {
  LANGUAGE_TAG,
  LANGUAGE_TAGS,
} from '../../../../../../shared/src/i18n/constants';
import content from '../../../../../../content/content.json';
import {Collection} from '../../../../../../shared/src/types/generated/Collection';

const getCollectionsByLanguage = (language: LANGUAGE_TAG) =>
  content.i18n[language].collections as unknown as Record<string, Collection>;

export function generateStaticParams() {
  // Return every language together. An empty result for one language makes
  // Next drop the whole static export, because it keeps the parent params
  // without this segment's id.
  return LANGUAGE_TAGS.flatMap(language =>
    Object.entries(getCollectionsByLanguage(language))
      .filter(([, {published}]) => published)
      .map(([collectionId]) => ({
        language,
        collectionId,
      })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{collectionId: string; language: string}>;
}) {
  const {language, collectionId} = await params;
  const collection = getCollectionsByLanguage(language as LANGUAGE_TAG)[
    collectionId
  ];
  return {
    title: `${collection.name} | Aware`,
    description: collection.description,
    itunes: {
      appId: '1631342681',
      appArgument: `https://29k.org/collections/${collectionId}?language=${language}`,
    },
    openGraph: {
      title: collection.name,
      images: collection.card?.image?.source,
      description: collection.description,
      locale: language,
      type: 'website',
    },
  };
}

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
