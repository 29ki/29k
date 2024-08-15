import React from 'react';
import ScreenWrapper from '../../uiLib/decorators/ScreenWrapper';
import CardGraphic from './CardGraphic';
import {ExerciseCard} from '../../../../../shared/src/types/generated/Exercise';
import {Heading16} from '../Typography/Heading/Heading';
import {Spacer28} from '../Spacers/Spacer';

const DUMMY_IMAGE_GRAPHIC: ExerciseCard = {
  imageBackgroundColor: '#D0E2DA',
  image: {
    source:
      'https://res.cloudinary.com/cupcake-29k/image/upload/q_auto,t_global/v1697618661/Images/values_collection_gmhmrl.png',
  },
};

const DUMMY_TRANSPARENT_IMAGE_GRAPHIC: ExerciseCard = {
  image: {
    source:
      'https://res.cloudinary.com/cupcake-29k/image/upload/q_auto,t_global/v1697618661/Images/values_collection_gmhmrl.png',
  },
};

const DUMMY_TRANSPARENT_LOTTIE_GRAPHIC: ExerciseCard = {
  lottie: {
    source:
      'https://res.cloudinary.com/cupcake-29k/raw/upload/q_auto,t_global/v1683720732/Lottie/aware_logo_teal_qqweff.json',
  },
};

const DUMMY_LOTTIE_GRAPHIC: ExerciseCard = {
  imageBackgroundColor: '#fff',
  lottie: {
    source:
      'https://res.cloudinary.com/cupcake-29k/raw/upload/q_auto,t_global/v1683720732/Lottie/aware_logo_teal_qqweff.json',
  },
};

export const AllTypes = () => (
  <ScreenWrapper>
    <Heading16>Transparent image</Heading16>
    <CardGraphic graphic={DUMMY_TRANSPARENT_IMAGE_GRAPHIC} />
    <Spacer28 />
    <Heading16>Transparent lottie</Heading16>
    <CardGraphic graphic={DUMMY_TRANSPARENT_LOTTIE_GRAPHIC} />
    <Spacer28 />
    <Heading16>Background image</Heading16>
    <CardGraphic graphic={DUMMY_IMAGE_GRAPHIC} />
    <Spacer28 />
    <Heading16>Background lottie</Heading16>
    <CardGraphic graphic={DUMMY_LOTTIE_GRAPHIC} />
  </ScreenWrapper>
);
