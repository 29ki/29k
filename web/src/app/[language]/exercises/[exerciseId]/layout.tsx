import {LANGUAGE_TAG} from '../../../../../../shared/src/i18n/constants';
import content from '../../../../../../content/content.json';
import {Exercise} from '../../../../../../shared/src/types/generated/Exercise';

const getExercisesByLanguage = (language: LANGUAGE_TAG) =>
  content.i18n[language].exercises as unknown as Record<string, Exercise>;

export async function generateStaticParams({
  params,
}: {
  params: {language: LANGUAGE_TAG};
}) {
  return Object.entries(getExercisesByLanguage(params.language))
    .filter(([, {published, excludeFromWeb}]) => published && !excludeFromWeb)
    .map(([exerciseId]) => ({
      exerciseId,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: {exerciseId: string; language: LANGUAGE_TAG};
}) {
  const exercise = getExercisesByLanguage(params.language)[params.exerciseId];
  return {
    title: `${exercise.name} | Aware`,
    description: exercise.description,
    openGraph: {
      title: exercise.socialMeta?.title || exercise.name,
      images: exercise.socialMeta?.image || exercise.card?.image?.source,
      description: exercise.socialMeta?.description || exercise.description,
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
