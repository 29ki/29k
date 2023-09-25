import React from 'react';

import ReadMore from '@fawazahmed/react-native-read-more';

import {COLORS} from '../../../../../shared/src/constants/colors';

import {useTranslation} from 'react-i18next';

import {Body16} from '../Typography/Body/Body';

const readMoreTextStyles = {color: COLORS.PRIMARY};

const ShowMoreText: React.FC<{
  numberOfLines?: number;
  children: React.ReactNode;
}> = ({numberOfLines = 5, children}) => {
  const {t} = useTranslation('Component.ShowMoreText');

  return (
    <ReadMore
      customTextComponent={Body16}
      numberOfLines={numberOfLines}
      seeLessText={t('shrinkLabel')}
      seeMoreText={t('expandLabel')}
      seeMoreStyle={readMoreTextStyles}
      seeLessStyle={readMoreTextStyles}
      animate={false}>
      {children}
    </ReadMore>
  );
};

export default ShowMoreText;
