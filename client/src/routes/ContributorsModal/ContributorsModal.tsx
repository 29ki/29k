import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useIsFocused} from '@react-navigation/native';
import hexToRgba from 'hex-to-rgba';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import {contributors} from '../../../../content/content.json';
import {COLORS} from '../../../../shared/src/constants/colors';

import Gutters from '../../common/components/Gutters/Gutters';
import SheetModal from '../../common/components/Modals/SheetModal';
import {
  BottomSafeArea,
  Spacer32,
  Spacer8,
} from '../../common/components/Spacers/Spacer';
import {Body16} from '../../common/components/Typography/Body/Body';
import {ModalHeading} from '../../common/components/Typography/Heading/Heading';
import {GUTTERS} from '../../common/constants/spacings';
import {Contributor} from './components/Contributor';

const Wrapper = styled.View({
  flex: 1,
});

const ContributorsList = styled(Gutters)({
  flexDirection: 'row',
  flexWrap: 'wrap',
});

const Header = styled(LinearGradient).attrs({
  colors: [
    hexToRgba(COLORS.WHITE, 1),
    hexToRgba(COLORS.WHITE, 1),
    hexToRgba(COLORS.WHITE, 0),
  ],
})({
  position: 'absolute',
  height: 120,
  left: GUTTERS.SMALL,
  right: GUTTERS.SMALL,
  zIndex: 1,
});

const BottomGradient = styled(LinearGradient).attrs({
  colors: [hexToRgba(COLORS.WHITE, 0), hexToRgba(COLORS.WHITE, 1)],
})({
  position: 'absolute',
  height: 80,
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1,
});

const ScrollView = styled(BottomSheetScrollView).attrs({
  contentContainerStyle: {paddingTop: 90},
})({...StyleSheet.absoluteFillObject});

const ContributorsModal = () => {
  const {t} = useTranslation('Modal.Contributors');

  return (
    <SheetModal>
      <Wrapper>
        <Header>
          <ModalHeading>{t('title')}</ModalHeading>
          <Spacer8 />
          <Body16>{t('text')}</Body16>
        </Header>

        <ScrollView focusHook={useIsFocused}>
          <ModalHeading>{t('coreTeam')}</ModalHeading>
          <ContributorsList>
            {contributors
              .filter(({contributions}) => contributions.includes('coreTeam'))
              .map(contributor => (
                <Contributor
                  key={contributor.name}
                  contributor={contributor as Contributor}
                />
              ))}
          </ContributorsList>
          <Spacer32 />

          <ModalHeading>{t('contributors')}</ModalHeading>
          <ContributorsList>
            {contributors
              .filter(({contributions}) => !contributions.includes('coreTeam'))
              .map(contributor => (
                <Contributor
                  key={contributor.name}
                  contributor={contributor as Contributor}
                />
              ))}
          </ContributorsList>
          <BottomSafeArea />
        </ScrollView>
        <BottomGradient />
      </Wrapper>
    </SheetModal>
  );
};

export default ContributorsModal;
