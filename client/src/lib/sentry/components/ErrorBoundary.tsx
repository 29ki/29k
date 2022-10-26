import React from 'react';
import styled from 'styled-components/native';
import {ErrorBoundary as SentryErrorBoundary} from '@sentry/react-native';
import {useTranslation} from 'react-i18next';

import * as NS from '../../../../../shared/src/constants/namespaces';
import Gutters from '../../../common/components/Gutters/Gutters';
import Markdown from '../../../common/components/Typography/Markdown/Markdown';

const Container = styled(Gutters)({
  flex: 1,
  justifyContent: 'center',
});

const CrashErrorMessage = () => {
  const {t} = useTranslation(NS.COMPONENT.CRASH_ERROR_MESSAGE);

  return (
    <Container>
      <Markdown>{t('text__markdown')}</Markdown>
    </Container>
  );
};

const ErrorBoundary: React.FC<{children: React.ReactNode}> = ({children}) => (
  <SentryErrorBoundary fallback={<CrashErrorMessage />}>
    {children}
  </SentryErrorBoundary>
);

export default ErrorBoundary;
