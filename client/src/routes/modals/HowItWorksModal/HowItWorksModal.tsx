import React from 'react';
import {useTranslation} from 'react-i18next';

import SheetModal from '../../../lib/components/Modals/SheetModal';
import {Spacer16} from '../../../lib/components/Spacers/Spacer';
import {ModalHeading} from '../../../lib/components/Typography/Heading/Heading';
import Gutters from '../../../lib/components/Gutters/Gutters';
import {
  HeadphonesIcon,
  LogoIcon,
  ArrowRightIcon,
  SparklesIcon,
} from '../../../lib/components/Icons';
import Markdown from '../../../lib/components/Typography/Markdown/Markdown';
import {Body16} from '../../../lib/components/Typography/Body/Body';
import DescriptionBlock from '../../../lib/components/DescriptionBlock/DescriptionBlock';

const HowItWorksModal = () => {
  const {t} = useTranslation('Modal.HowItWorks');

  return (
    <SheetModal>
      <ModalHeading>{t('title')}</ModalHeading>
      <Spacer16 />
      <Gutters>
        <DescriptionBlock Icon={LogoIcon}>
          <Body16>{t('item1')}</Body16>
        </DescriptionBlock>
        <Spacer16 />
        <DescriptionBlock Icon={SparklesIcon}>
          <Body16>{t('item2')}</Body16>
        </DescriptionBlock>
        <Spacer16 />
        <DescriptionBlock Icon={HeadphonesIcon}>
          <Body16>{t('item3')}</Body16>
        </DescriptionBlock>

        <DescriptionBlock Icon={ArrowRightIcon} transparent>
          <Markdown>{t('codeOfConduct')}</Markdown>
        </DescriptionBlock>
      </Gutters>
    </SheetModal>
  );
};

export default HowItWorksModal;
