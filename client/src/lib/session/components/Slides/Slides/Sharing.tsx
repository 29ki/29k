import React from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {Body18} from '../../../../components/Typography/Body/Body';

const Wrapper = styled.View({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

const Sharing = () => {
  const {t} = useTranslation('Component.Sharing');
  return (
    <Wrapper>
      <Body18>{t('text')}</Body18>
    </Wrapper>
  );
};

export default React.memo(Sharing);
