import React from 'react';
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

const Wrapper = styled.View({
  flex: 1,
});

const contributors: Contributor[] = (
  content.contributors as Contributor[]
).filter(
  ({contributions}) =>
    !contributions.includes('corePartner') &&
    !contributions.includes('partner'),
);

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

        <ScrollView>
          <ModalHeading>{t('founders')}</ModalHeading>
          <ContributorsList>
            {contributors
              .filter(({contributions}) => contributions.includes('founder'))
              .map(contributor => (
                <Contributor
                  key={contributor.name}
                  contributor={contributor as Contributor}
                />
              ))}
          </ContributorsList>
          <Spacer32 />

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
              .filter(
                ({contributions}) =>
                  !contributions.includes('founder') &&
                  !contributions.includes('partner') &&
                  !contributions.includes('coreTeam'),
              )
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
