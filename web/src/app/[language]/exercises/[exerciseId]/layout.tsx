import {LANGUAGE_TAG} from '../../../../../../shared/src/i18n/constants';
import content from '../../../../../../content/content.json';

export async function generateStaticParams({
  params,
}: {
  params: {language: LANGUAGE_TAG};
}) {
  return Object.keys(content.i18n[params.language].exercises).map(
    exerciseId => ({
      exerciseId,
    }),
  );
}

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
