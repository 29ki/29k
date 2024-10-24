import {LANGUAGE_TAG} from '../../../../../../shared/src/i18n/constants';
import content from '../../../../../../content/content.json';
import {Exercise} from '../../../../../../shared/src/types/generated/Exercise';

export async function generateStaticParams({
  params,
}: {
  params: {language: LANGUAGE_TAG};
}) {
  return Object.entries(
    content.i18n[params.language].exercises as unknown as Record<
      string,
      Exercise
    >,
  )
    .filter(([, {published, excludeFromWeb}]) => published && !excludeFromWeb)
    .map(([exerciseId]) => ({
      exerciseId,
    }));
}

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
