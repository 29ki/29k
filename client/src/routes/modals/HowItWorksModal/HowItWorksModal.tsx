import React from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';

import SheetModal from '../../../lib/components/Modals/SheetModal';
import {Spacer16, Spacer8} from '../../../lib/components/Spacers/Spacer';
import {ModalHeading} from '../../../lib/components/Typography/Heading/Heading';
import Gutters from '../../../lib/components/Gutters/Gutters';
import ActionList from '../../../lib/components/ActionList/ActionList';
import {
  HeadphonesIcon,
  LogoIcon,
  ArrowRightIcon,
  SparklesIcon,
} from '../../../lib/components/Icons';
import Markdown from '../../../lib/components/Typography/Markdown/Markdown';
import {Body16} from '../../../lib/components/Typography/Body/Body';
import {SPACINGS} from '../../../lib/constants/spacings';

const Wrapper = styled.View({
  flex: 1,
});

const Row = styled.View({
  flexDirection: 'row',
  padding: SPACINGS.TWELVE,
});

const IconWrapper = styled.View({
  width: 30,
  height: 30,
});

const TextWrapper = styled.View({
  flexShrink: 1,
});

const HowItWorksModal = () => {
  const {t} = useTranslation('Modal.HowItWorks');

  return (
    <SheetModal>
      <Wrapper>
        <ModalHeading>{t('title')}</ModalHeading>
        <Spacer16 />
        <Gutters>
          <ActionList>
            <Row>
              <IconWrapper>
                <LogoIcon />
              </IconWrapper>
              <Spacer8 />
              <TextWrapper>
                <Body16>{t('item1')}</Body16>
              </TextWrapper>
            </Row>
          </ActionList>
          <Spacer8 />
          <ActionList>
            <Row>
              <IconWrapper>
                <SparklesIcon />
              </IconWrapper>
              <Spacer8 />
              <TextWrapper>
                <Body16>{t('item2')}</Body16>
              </TextWrapper>
            </Row>
          </ActionList>
          <Spacer8 />
          <ActionList>
            <Row>
              <IconWrapper>
                <HeadphonesIcon />
              </IconWrapper>
              <Spacer8 />
              <TextWrapper>
                <Body16>{t('item3')}</Body16>
              </TextWrapper>
            </Row>
          </ActionList>
          <Spacer8 />
          <Row>
            <IconWrapper>
              <ArrowRightIcon />
            </IconWrapper>
            <Spacer8 />
            <TextWrapper>
              <Markdown>{t('codeOfConduct')}</Markdown>
            </TextWrapper>
          </Row>
        </Gutters>
      </Wrapper>
    </SheetModal>
  );
};

export default HowItWorksModal;
