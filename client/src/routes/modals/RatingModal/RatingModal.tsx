import React, {useCallback} from 'react';
import Rate from 'react-native-rate';
import {Platform} from 'react-native';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {IOS_APPSTORE_ID, ANDROID_PACKAGE_NAME} from 'config';
import Gutters from '../../../lib/components/Gutters/Gutters';
import CardModal from '../../../lib/components/Modals/CardModal';

import {Heading16} from '../../../lib/components/Typography/Heading/Heading';

import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {Spacer16} from '../../../lib/components/Spacers/Spacer';
import {ModalStackProps} from '../../../lib/navigation/constants/routes';
import {Body16} from '../../../lib/components/Typography/Body/Body';
import Button from '../../../lib/components/Buttons/Button';
import {logEvent} from '../../../lib/metrics';

const RATING_OPTIONS = {
  AppleAppID: IOS_APPSTORE_ID,
  GooglePackageName: ANDROID_PACKAGE_NAME,
  preferInApp: true,
  openAppStoreIfInAppFails: true,
};

const STORE_TYPE = Platform.select({
  android: 'Google Play Store',
  ios: 'App Store',
});

const Container = styled.View({
  flex: 1,
  alignItems: 'center',
});

const ActionRow = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-around',
});

const YesButton = styled(Button)({
  alignSelf: 'center',
});

const NoButton = styled(Button)({
  alignSelf: 'center',
});

const RatingModal = () => {
  const {t} = useTranslation('Modal.Rating');
  const {goBack} = useNavigation<NativeStackNavigationProp<ModalStackProps>>();

  const handleRatingRequest = useCallback(() => {
    goBack();

    Rate.rate(RATING_OPTIONS, (success: boolean) => {
      if (success) {
        logEvent('Rating Request Opened', undefined);
      }
    });
  }, [goBack]);

  return (
    <CardModal>
      <Container>
        <Gutters>
          <Heading16>{t('title', {storeType: STORE_TYPE})}</Heading16>
          <Spacer16 />
          <Body16>{t('description')}</Body16>
          <Spacer16 />
          <ActionRow>
            <YesButton onPress={handleRatingRequest}>{t('yes')}</YesButton>
            <NoButton variant="secondary" onPress={goBack}>
              {t('no')}
            </NoButton>
          </ActionRow>
        </Gutters>
      </Container>
    </CardModal>
  );
};

export default RatingModal;
