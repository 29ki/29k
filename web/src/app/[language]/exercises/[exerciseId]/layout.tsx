import {
  LANGUAGE_TAG,
  LANGUAGE_TAGS,
} from '../../../../../../shared/src/i18n/constants';
import content from '../../../../../../content/content.json';
import {Exercise} from '../../../../../../shared/src/types/generated/Exercise';
import {Suspense} from 'react';

const getExercisesByLanguage = (language: LANGUAGE_TAG) =>
  content.i18n[language].exercises as unknown as Record<string, Exercise>;

export function generateStaticParams() {
  // Return every language together. An empty result for one language makes
  // Next drop the whole static export, because it keeps the parent params
  // without this segment's id.
  return LANGUAGE_TAGS.flatMap(language =>
    Object.entries(getExercisesByLanguage(language))
      .filter(([, {published, excludeFromWeb}]) => published && !excludeFromWeb)
      .map(([exerciseId]) => ({
        language,
        exerciseId,
      })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{exerciseId: string; language: string}>;
}) {
  const {language, exerciseId} = await params;
  const exercise = getExercisesByLanguage(language as LANGUAGE_TAG)[exerciseId];
  return {
    title: `${exercise.name} | Aware`,
    description: exercise.description,
    itunes: {
      appId: '1631342681',
      appArgument: `https://29k.org/sessions/${exerciseId}?language=${language}`,
    },
    openGraph: {
      title: exercise.socialMeta?.title || exercise.name,
      images: exercise.socialMeta?.image || exercise.card?.image?.source,
      description: exercise.socialMeta?.description || exercise.description,
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
  return <Suspense>{children}</Suspense>;
}
