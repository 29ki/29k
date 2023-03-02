import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {Collection} from '../../../../../shared/src/types/generated/Collection';
import {HKGroteskBold, HKGroteskRegular} from '../../constants/fonts';
import useCompletedSessionsCount from '../../sessions/hooks/useCompletedSessionsCount';
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
  collection: Collection | null;
  emptyComponent?: React.ReactNode;
};

export const CompletedSessionsCount: React.FC<CompletedSessionsCountProps> = ({
  collection,
  emptyComponent,
}) => {
  const {t} = useTranslation('Component.CompletedSessionsCount');
  const {getCompletedSessionsCountByCollection} = useCompletedSessionsCount();
  const [completedSessionsCount, setCompletedSessionsCount] = useState(0); // TODO: get this from some storage

  useEffect(() => {
    if (collection) {
      setCompletedSessionsCount(
        getCompletedSessionsCountByCollection(collection),
      );
    }
  }, [
    collection,
    setCompletedSessionsCount,
    getCompletedSessionsCountByCollection,
  ]);

  if (!completedSessionsCount) {
    if (emptyComponent) {
      return <>{emptyComponent}</>;
    }
    return null;
  }

  return (
    <Footer>
      <NumberText>{completedSessionsCount}</NumberText>
      <Spacer4 />
      <FooterText>{t('text')}</FooterText>
    </Footer>
  );
};

export default React.memo(CompletedSessionsCount);
