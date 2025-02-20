import './globals.css';
import StyleSheetRegistry from '@/lib/StyleSheetRegistry';
import type {Metadata} from 'next';
import {
  CLIENT_LANGUAGE_TAGS,
  LANGUAGE_TAG,
  LANGUAGE_TAGS,
} from '../../../../shared/src/i18n/constants';
import I18nProvider from '@/lib/I18nProvider';

export const metadata: Metadata = {
  title: 'Aware',
  itunes: {
    appId: '1631342681',
  },
};

export function generateStaticParams() {
  return LANGUAGE_TAGS.map(language => ({
    language,
  }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: {language: LANGUAGE_TAG};
}>) {
  return (
    <html lang={params.language}>
      <body>
        <I18nProvider language={params.language}>
          <StyleSheetRegistry>{children}</StyleSheetRegistry>
        </I18nProvider>
      </body>
    </html>
  );
}
