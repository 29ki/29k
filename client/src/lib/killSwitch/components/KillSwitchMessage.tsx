import React from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, Image as RNImage, Linking} from 'react-native';
import {useRecoilValue} from 'recoil';
import styled from 'styled-components/native';
import Button from '../../../common/components/Buttons/Button';
import Gutters from '../../../common/components/Gutters/Gutters';
import {Spacer40} from '../../../common/components/Spacers/Spacer';
import Markdown from '../../../common/components/Typography/Markdown/Markdown';
import {COLORS} from '../../../common/constants/colors';
import NS from '../../i18n/constants/namespaces';
import useKillSwitch from '../hooks/useKillSwitch';
import {killSwitchFields, killSwitchMessageAtom} from '../state/state';

const Container = styled.View({
  flex: 1,
  justifyContent: 'center',
});

const Image = styled(RNImage)({
  width: '100%',
  aspectRatio: '1.6',
});

const KillSwitchMessage = () => {
  const {t} = useTranslation(NS.SCREEN.KILL_SWITCH);
  const checkKillSwitch = useKillSwitch();
  const {image, message, button} = useRecoilValue(killSwitchMessageAtom);
  const isLoading = useRecoilValue(killSwitchFields('isLoading'));
  const hasFailed = useRecoilValue(killSwitchFields('hasFailed'));
  const isRetriable = useRecoilValue(killSwitchFields('isRetriable'));

  const handleLinkButton = () => {
    if (button && 'link' in button) {
      Linking.openURL(button.link);
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
        {image && (
          <>
            <Image source={{uri: image}} resizeMode="contain" />
            <Spacer40 />
          </>
        )}
        {message && (
          <Gutters>
            <Markdown>{message}</Markdown>
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
      {button && (
        <>
          <Gutters>
            <Button onPress={handleLinkButton}>{button.text}</Button>
          </Gutters>
          <Spacer40 />
        </>
      )}
      {isRetriable && (
        <>
          <Gutters>
            <Button onPress={handleRetryButton}>{t('retry')}</Button>
          </Gutters>
          <Spacer40 />
        </>
      )}
    </>
  );
};

export default KillSwitchMessage;
