import React, {useCallback, useContext} from 'react';
import ScreenWrapper from '../../uiLib/decorators/ScreenWrapper';
import Button from '../Buttons/Button';
import {ErrorBannerContext} from '../../contexts/ErrorBannerContext';
import {Spacer16} from '../Spacers/Spacer';
import ErrorBanner from './ErrorBanner';

export const ErrorBanners = () => (
  <ErrorBanner>
    <AllErrorBanners />
  </ErrorBanner>
);

const AllErrorBanners = () => {
  const errorBannerContext = useContext(ErrorBannerContext);
  const onBannerWithoutActionPress = useCallback(() => {
    errorBannerContext?.showError('Error title', 'Error message');
  }, [errorBannerContext]);

  const onBannerWithActionPress = useCallback(() => {
    errorBannerContext?.showError('Error title', 'Error message', {
      text: 'Action',
      action: () => console.log('on press'),
    });
  }, [errorBannerContext]);
  return (
    <ScreenWrapper>
      <Button onPress={onBannerWithoutActionPress}>
        {'Banner without action'}
      </Button>
      <Spacer16 />
      <Button onPress={onBannerWithActionPress}>{'Banner with action'}</Button>
    </ScreenWrapper>
  );
};
