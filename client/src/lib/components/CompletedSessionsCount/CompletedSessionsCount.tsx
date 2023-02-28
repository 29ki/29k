import React from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {HKGroteskBold, HKGroteskRegular} from '../../constants/fonts';
import {Spacer4} from '../Spacers/Spacer';
import {Body12} from '../Typography/Body/Body';

const Footer = styled.View({
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'baseline',
});

const NumberText = styled(Body12)({
  fontFamily: HKGroteskBold,
});

const FooterText = styled.Text.attrs({allowFontScaling: false})({
  color: COLORS.BLACK,
  fontSize: 10,
  lineHeight: 14,
  fontFamily: HKGroteskRegular,
});

type CompletedSessionsCountProps = {
  count: number;
};

export const CompletedSessionsCount: React.FC<CompletedSessionsCountProps> = ({
  count,
}) => {
  const {t} = useTranslation('Component.CompletedSessionsCount');
  return (
    <Footer>
      <NumberText>{count}</NumberText>
      <Spacer4 />
      <FooterText>{t('text')}</FooterText>
    </Footer>
  );
};

export default React.memo(CompletedSessionsCount);
