import React from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';

import SheetModal from '../../../lib/components/Modals/SheetModal';
import {Spacer16} from '../../../lib/components/Spacers/Spacer';
import {ModalHeading} from '../../../lib/components/Typography/Heading/Heading';
import Markdown from '../../../lib/components/Typography/Markdown/Markdown';
import Gutters from '../../../lib/components/Gutters/Gutters';
import Image from '../../../lib/components/Image/Image';

const GraphicsWrapper = styled.View({
  height: 240,
  borderRadius: 24,
  overflow: 'hidden',
});

const Wrapper = styled.View({
  flex: 1,
});

const HowItWorksModal = () => {
  const {t} = useTranslation('Modal.HowItWorks');

  const imageUrl = t('imageUrl');

  return (
    <SheetModal>
      <Wrapper>
        <ModalHeading>{t('title')}</ModalHeading>
        <Spacer16 />
        <Gutters>
          <Markdown>{t('body__markdown')}</Markdown>
          {imageUrl && (
            <GraphicsWrapper>
              <Image resizeMode="contain" source={{uri: imageUrl}} />
            </GraphicsWrapper>
          )}
        </Gutters>
      </Wrapper>
    </SheetModal>
  );
};

export default HowItWorksModal;
