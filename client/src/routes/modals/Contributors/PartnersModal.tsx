import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import content from '../../../../../content/content.json';

import SheetModal from '../../../lib/components/Modals/SheetModal';
import {
  BottomSafeArea,
  Spacer32,
  Spacer8,
} from '../../../lib/components/Spacers/Spacer';
import {Body16} from '../../../lib/components/Typography/Body/Body';
import {ModalHeading} from '../../../lib/components/Typography/Heading/Heading';
import {BottomGradient} from './components/BottomGradient';
import {Contributor} from './components/Contributor';
import {Header} from './components/Header';
import {ScrollView} from './components/ScrollView';
import {ContributorsList} from './components/ContributorsList';
import * as linking from '../../../lib/linking/nativeLinks';

const Wrapper = styled.View({
  flex: 1,
});

const partners: Contributor[] = (content.contributors as Contributor[]).filter(
  ({contributions}) =>
    contributions.includes('corePartner') || contributions.includes('partner'),
);

const ContributorWrapper: React.FC<{contributor: Contributor}> = ({
  contributor,
}) => {
  const onPress = useCallback(() => {
    if (contributor.profile) {
      linking.openURL(contributor.profile);
    }
  }, [contributor]);

  return (
    <Contributor
      onPress={contributor.profile ? onPress : undefined}
      contributor={contributor}
    />
  );
};

const PartnersModal = () => {
  const {t} = useTranslation('Modal.Partners');

  return (
    <SheetModal>
      <Wrapper>
        <Header>
          <ModalHeading>{t('title')}</ModalHeading>
          <Spacer8 />
          <Body16>{t('text')}</Body16>
        </Header>

        <ScrollView>
          <ModalHeading>{t('corePartners')}</ModalHeading>
          <ContributorsList>
            {partners
              .filter(({contributions}) =>
                contributions.includes('corePartner'),
              )
              .map(contributor => (
                <ContributorWrapper
                  key={contributor.name}
                  contributor={contributor}
                />
              ))}
          </ContributorsList>
          <Spacer32 />

          <ModalHeading>{t('partners')}</ModalHeading>
          <ContributorsList>
            {partners
              .filter(({contributions}) => contributions.includes('partner'))
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

export default PartnersModal;
