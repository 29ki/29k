import React from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, Image as RNImage} from 'react-native';
import styled from 'styled-components/native';
import Button from '../../components/Buttons/Button';
import Gutters from '../../components/Gutters/Gutters';
import {Spacer40} from '../../components/Spacers/Spacer';
import Markdown from '../../components/Typography/Markdown/Markdown';
import {COLORS} from '../../../../../shared/src/constants/colors';
import useKillSwitch from '../hooks/useKillSwitch';
import useKillSwitchState from '../state/state';
import * as linking from '../../linking/nativeLinks';

const Container = styled.View({
  flex: 1,
  justifyContent: 'center',
});

const Image = styled(RNImage)({
  width: '100%',
  aspectRatio: '1.6',
});

const CenteredButton = styled(Button)({
  alignSelf: 'center',
});

const KillSwitchMessage = () => {
  const {t} = useTranslation('Screen.KillSwitch');
  const checkKillSwitch = useKillSwitch();
  const {isLoading, hasFailed, isRetriable, message} = useKillSwitchState();

  const handleLinkButton = () => {
    if (message?.button && 'link' in message.button) {
      linking.openURL(message.button.link);
    }
  };

  const handleRetryButton = () => {
    checkKillSwitch();
  };

  return (
    <>
      <Container>
        {Boolean(isLoading) && (
          <ActivityIndicator size="large" color={COLORS.GREYLIGHTEST} />
        )}
        {message?.image && (
          <>
            <Image source={{uri: message.image}} resizeMode="contain" />
            <Spacer40 />
          </>
        )}
        {message?.message && (
          <Gutters>
            <Markdown>{message?.message}</Markdown>
          </Gutters>
        )}
        {hasFailed && (
          <>
            <Image
              source={{uri: t('failed.image__image')}}
              resizeMode="contain"
            />
            <Spacer40 />
            <Gutters>
              <Markdown>{t('failed.text__markdown')}</Markdown>
            </Gutters>
          </>
        )}
      </Container>
      {message?.button && (
        <>
          <Gutters>
            <CenteredButton onPress={handleLinkButton}>
              {message?.button.text}
            </CenteredButton>
          </Gutters>
          <Spacer40 />
        </>
      )}
      {isRetriable && (
        <>
          <Gutters>
            <CenteredButton onPress={handleRetryButton}>
              {t('retry')}
            </CenteredButton>
          </Gutters>
          <Spacer40 />
        </>
      )}
    </>
  );
};

export default KillSwitchMessage;
