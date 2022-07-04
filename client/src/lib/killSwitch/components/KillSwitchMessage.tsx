import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  Image,
  Linking,
  StyleSheet,
  View,
} from 'react-native';
import {useRecoilValue} from 'recoil';
import Button from '../../../common/components/Buttons/Button';
import Gutters from '../../../common/components/Gutters/Gutters';
import {Spacer40} from '../../../common/components/Spacers/Spacer';
import Markdown from '../../../common/components/Typography/Markdown/Markdown';
import {COLORS} from '../../../common/constants/colors';
import useKillSwitch from '../hooks/useKillSwitch';
import {killSwitchFields, killSwitchMessageAtom} from '../state/state';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    aspectRatio: 1.6,
  },
});

const KillSwitchMessage = () => {
  const {t} = useTranslation();
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
      <View style={styles.container}>
        {Boolean(isLoading) && (
          <ActivityIndicator size="large" color={COLORS.GREY100} />
        )}
        {image && (
          <>
            <Image
              source={{uri: image}}
              resizeMode="contain"
              style={styles.image}
            />
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
              style={styles.image}
            />
            <Spacer40 />
            <Gutters>
              <Markdown>{t('failed.text__markdown')}</Markdown>
            </Gutters>
          </>
        )}
      </View>
      {button && (
        <>
          <Gutters>
            <Button onPress={handleLinkButton} title={button.text} />
          </Gutters>
          <Spacer40 />
        </>
      )}
      {isRetriable && (
        <>
          <Gutters>
            <Button onPress={handleRetryButton} title={t('retry')} />
          </Gutters>
          <Spacer40 />
        </>
      )}
    </>
  );
};

export default KillSwitchMessage;
