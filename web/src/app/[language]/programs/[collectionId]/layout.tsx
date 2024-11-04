import {LANGUAGE_TAG} from '../../../../../../shared/src/i18n/constants';
import content from '../../../../../../content/content.json';
import {Collection} from '../../../../../../shared/src/types/generated/Collection';

const getCollectionsByLanguage = (language: LANGUAGE_TAG) =>
  content.i18n[language].collections as unknown as Record<string, Collection>;

export async function generateStaticParams({
  params,
}: {
  params: {language: LANGUAGE_TAG};
}) {
  return Object.entries(getCollectionsByLanguage(params.language))
    .filter(([, {published}]) => published)
    .map(([collectionId]) => ({
      collectionId,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: {collectionId: string; language: LANGUAGE_TAG};
}) {
  const collection = getCollectionsByLanguage(params.language)[
    params.collectionId
  ];
  return {
    title: `${collection.name} | Aware`,
    description: collection.description,
    itunes: {
      appId: '1631342681',
      appArgument: `https://29k.org/collections/${params.collectionId}?language=${params.language}`,
    },
    openGraph: {
      title: collection.name,
      images: collection.card?.image?.source,
      description: collection.description,
      locale: params.language,
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
