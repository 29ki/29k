import React from 'react';
import styled from 'styled-components/native';

import ScreenWrapper from '../../uiLib/decorators/ScreenWrapper';
import Badge from '../Badge/Badge';
import {CommunityIcon, FriendsIcon, MeIcon} from '../Icons';
import {Spacer16, Spacer4, Spacer8} from '../Spacers/Spacer';
import {Body14, BodyBold} from '../Typography/Body/Body';
import Card from './Card';
import CollectionFullCard from './CollectionCards/CollectionFullCard';
import CollectionListCard from './CollectionCards/CollectionListCard';
import {UserProfileType} from '../../../../../shared/src/schemas/User';
import {ExerciseCard} from '../../../../../shared/src/types/generated/Exercise';
import Button from '../Buttons/Button';
import CardSmall from './CardSmall';
import Interested from '../Interested/Interested';
import Node from '../Node/Node';
import {Collection} from '../../../../../shared/src/types/generated/Collection';

const VerticalAlign = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const Narrow = styled.View({
  width: 250,
});

const DUMMY_TAGS = [
  '30 min',
  'Self-Compassion',
  'Relationships',
  'Anxiety',
  'Stress',
  'Fear',
];

const DUMMY_HOST: UserProfileType = {
  uid: 'some-uid',
  displayName: 'Jenny Rickardsson',
  photoURL:
    'https://res.cloudinary.com/cupcake-29k/image/upload/t_cocreator_image/v1682602411/Images/Jenny_Rickardsson_kopia_sdodwf.jpg',
};

const DUMMY_IMAGE_GRAPHIC: ExerciseCard = {
  backgroundColor: '#D0E2DA',
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
  backgroundColor: '#fff',
  lottie: {
    source:
      'https://res.cloudinary.com/cupcake-29k/raw/upload/q_auto,t_global/v1683720732/Lottie/aware_logo_teal_qqweff.json',
  },
};

const DUMMY_COLLECTION: Collection = {
  id: 'some-id',
  name: 'Collection name',
  published: true,
  exercises: [],
};

const CardsList = () => (
  <>
    <Card
      title="Pure Simple Love"
      tags={DUMMY_TAGS}
      hostProfile={DUMMY_HOST}
      graphic={DUMMY_TRANSPARENT_IMAGE_GRAPHIC}
      onPress={() => {}}>
      <VerticalAlign>
        <Body14>Starts</Body14>
        <Spacer4 />
        <Badge text="09:00" IconAfter={<CommunityIcon />} />
      </VerticalAlign>
    </Card>
    <Spacer16 />
    <Card
      title="Accepting thoughts and feelings"
      tags={DUMMY_TAGS}
      hostProfile={DUMMY_HOST}
      graphic={DUMMY_TRANSPARENT_LOTTIE_GRAPHIC}
      onPress={() => {}}>
      <Button size="xsmall" variant="secondary" onPress={() => {}}>
        <BodyBold>Join</BodyBold>
      </Button>
      <Spacer8 />
      <Badge text="Shortly" IconAfter={<FriendsIcon />} />
    </Card>
    <Spacer16 />
    <Card
      title="Accepting thoughts and feeeeeeeeeeeeeelings"
      tags={DUMMY_TAGS}
      hostProfile={DUMMY_HOST}
      graphic={DUMMY_IMAGE_GRAPHIC}
      isPinned
      onPress={() => {}}>
      <VerticalAlign>
        <Body14>Starts</Body14>
        <Spacer4 />
        <Badge text="Mon, 7 Sep 17.30" IconAfter={<CommunityIcon />} />
      </VerticalAlign>
    </Card>
    <Spacer16 />
    <Card
      title="Accepting thoughts and feeeeeeeeeeeeeelings"
      tags={DUMMY_TAGS}
      hostProfile={DUMMY_HOST}
      graphic={DUMMY_IMAGE_GRAPHIC}
      isPinned
      collection={DUMMY_COLLECTION}
      onPress={() => {}}>
      <VerticalAlign>
        <Body14>Starts</Body14>
        <Spacer4 />
        <Badge text="Mon, 7 Sep 17.30" IconAfter={<CommunityIcon />} />
      </VerticalAlign>
    </Card>
    <Spacer16 />
    <Card
      title="Accepting thoughts and feelings"
      tags={DUMMY_TAGS}
      hostProfile={DUMMY_HOST}
      graphic={DUMMY_LOTTIE_GRAPHIC}
      isPinned
      reminderEnabled
      onPress={() => {}}>
      <VerticalAlign>
        <Body14>Starts</Body14>
        <Spacer4 />
        <Badge text="Mon, 7 Sep 17.30" IconAfter={<CommunityIcon />} />
      </VerticalAlign>
    </Card>
    <Spacer16 />
    <Card
      title="Pure Simple Love"
      description="Visualizing our future can guide us in the present moment by shining a light on what’s important in the long run.\n\nThis can be extra helpful when we’re under pressure, when we tend to be short-sighted and out of touch with what truly matters."
      graphic={DUMMY_IMAGE_GRAPHIC}
      tags={DUMMY_TAGS}
      onPress={() => {}}
    />
    <Spacer16 />
    <Card
      title="Accepting thoughts and feeeeeeeeeeeeeelings"
      description="Visualizing our future can guide us in the present moment by shining a light on what’s important in the long run.\n\nThis can be extra helpful when we’re under pressure, when we tend to be short-sighted and out of touch with what truly matters."
      graphic={DUMMY_IMAGE_GRAPHIC}
      tags={DUMMY_TAGS}
      onPress={() => {}}
    />
    <Spacer16 />
    <Narrow>
      <Card
        title="Accepting thoughts and feelings"
        tags={DUMMY_TAGS}
        hostProfile={DUMMY_HOST}
        graphic={DUMMY_IMAGE_GRAPHIC}
        interestedCount={3}
        onPress={() => {}}>
        <VerticalAlign>
          <Badge text="Mon, 7 Sep 17.30" IconAfter={<CommunityIcon />} />
        </VerticalAlign>
      </Card>
    </Narrow>
    <Narrow>
      <Card
        title="Accepting thoughts and feeeeeeeeeeeeeelings"
        description="Visualizing our future can guide us in the present moment by shining a light on what’s important in the long run.\n\nThis can be extra helpful when we’re under pressure, when we tend to be short-sighted and out of touch with what truly matters."
        graphic={DUMMY_IMAGE_GRAPHIC}
        tags={DUMMY_TAGS}
        onPress={() => {}}
      />
    </Narrow>
  </>
);

export const Cards = () => (
  <ScreenWrapper>
    <CardsList />
  </ScreenWrapper>
);

const CardSmallsList = () => (
  <>
    <CardSmall
      title="Pure Simple Love"
      graphic={DUMMY_TRANSPARENT_IMAGE_GRAPHIC}
      onPress={() => {}}
    />
    <Spacer16 />
    <CardSmall
      title="Accepting thoughts and feeeeeeeeeeeeeelings"
      graphic={DUMMY_TRANSPARENT_LOTTIE_GRAPHIC}
      onPress={() => {}}
    />
    <Spacer16 />
    <CardSmall
      title="Pure Simple Love"
      hostProfile={DUMMY_HOST}
      graphic={DUMMY_IMAGE_GRAPHIC}
      onPress={() => {}}
    />
    <Spacer16 />
    <CardSmall
      title="Accepting thoughts and feeeeeeeeeeeeeelings"
      hostProfile={DUMMY_HOST}
      graphic={DUMMY_LOTTIE_GRAPHIC}
      onPress={() => {}}
    />
    <Spacer16 />
    <CardSmall
      title="Pure Simple Love"
      tags={DUMMY_TAGS}
      graphic={DUMMY_IMAGE_GRAPHIC}
      onPress={() => {}}
    />
    <Spacer16 />
    <CardSmall
      title="Accepting thoughts and feeeeeeeeeeeeeelings"
      tags={DUMMY_TAGS}
      graphic={DUMMY_IMAGE_GRAPHIC}
      onPress={() => {}}
    />
    <Spacer16 />
    <CardSmall
      title="Pure Simple Love"
      tags={DUMMY_TAGS}
      hostProfile={DUMMY_HOST}
      graphic={DUMMY_IMAGE_GRAPHIC}
      onPress={() => {}}
    />
    <Spacer16 />
    <CardSmall
      title="Accepting thoughts and feeeeeeeeeeeeeelings"
      tags={DUMMY_TAGS}
      hostProfile={DUMMY_HOST}
      graphic={DUMMY_IMAGE_GRAPHIC}
      onPress={() => {}}
    />
    <Spacer16 />
    <CardSmall
      title="Accepting thoughts and feeeeeeeeeeeeeelings"
      tags={DUMMY_TAGS}
      collection={DUMMY_COLLECTION}
      hostProfile={DUMMY_HOST}
      graphic={DUMMY_IMAGE_GRAPHIC}
      onPress={() => {}}
    />
    <Spacer16 />
    <CardSmall
      title="Accepting thoughts and feeeeeeeeeeeeeelings"
      collection={DUMMY_COLLECTION}
      hostProfile={DUMMY_HOST}
      graphic={DUMMY_IMAGE_GRAPHIC}
      onPress={() => {}}
    />
    <Spacer16 />
    <CardSmall
      title="Pure Simple Love"
      hostProfile={DUMMY_HOST}
      graphic={DUMMY_IMAGE_GRAPHIC}
      onPress={() => {}}>
      <Body14>Starts</Body14>
      <Spacer4 />
      <Badge text="Mon, 7 Sep 17.30" IconAfter={<CommunityIcon />} />
      <Spacer4 />
      <Interested compact reminder count={2} />
    </CardSmall>
    <Spacer16 />
    <CardSmall
      title="Accepting thoughts and feeeeeeeeeeeeeelings"
      hostProfile={DUMMY_HOST}
      graphic={DUMMY_IMAGE_GRAPHIC}
      onPress={() => {}}>
      <Body14>Starts</Body14>
      <Spacer4 />
      <Badge text="Mon, 7 Sep 17.30" IconAfter={<CommunityIcon />} />
      <Spacer4 />
      <Interested compact reminder count={2} />
    </CardSmall>
    <Spacer16 />
    <CardSmall
      title="Pure Simple Love"
      graphic={DUMMY_IMAGE_GRAPHIC}
      completed
      onPress={() => {}}>
      <Node size={16} />
      <Spacer4 />
      <Body14>Completed</Body14>
      <Spacer4 />
      <Badge text="Mon, 7 Sep 17.30" IconAfter={<MeIcon />} />
    </CardSmall>
    <Spacer16 />
    <CardSmall
      title="Accepting thoughts and feeeeeeeeeeeeeelings"
      hostProfile={DUMMY_HOST}
      graphic={DUMMY_IMAGE_GRAPHIC}
      completed
      onPress={() => {}}>
      <Node size={16} />
      <Spacer4 />
      <Body14>Completed</Body14>
      <Spacer4 />
      <Badge text="Mon, 7 Sep 17.30" IconAfter={<CommunityIcon />} />
    </CardSmall>
    <Spacer16 />
    <CardSmall
      title="Accepting thoughts and feeeeeeeeeeeeeelings"
      hostProfile={DUMMY_HOST}
      graphic={DUMMY_IMAGE_GRAPHIC}
      completed
      onPress={() => {}}>
      <Node size={16} />
      <Spacer4 />
      <Body14>Completed</Body14>
      <Spacer4 />
      <Badge text="Mon, 7 Sep 17.30" IconAfter={<CommunityIcon />} />
    </CardSmall>
    <Spacer16 />

    <Narrow>
      <CardSmall
        title="Accepting thoughts and feeeeeeeeeeeeeelings"
        hostProfile={DUMMY_HOST}
        graphic={DUMMY_IMAGE_GRAPHIC}
        onPress={() => {}}>
        <Badge text="Mon, 7 Sep 17.30" IconAfter={<CommunityIcon />} />
        <Spacer4 />
        <Interested compact reminder count={2} />
      </CardSmall>
    </Narrow>
  </>
);

export const CardSmalls = () => (
  <ScreenWrapper>
    <CardSmallsList />
  </ScreenWrapper>
);

const CollectionCardsList = () => (
  <>
    <CollectionFullCard
      title="Collection Card full size"
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/q_auto,t_global/v1636016815/Singles/sticky_eng_ps00eg.png',
      }}
      progressItems={[true, true, false, false, false]}
      onPress={() => {}}
    />
    <Spacer16 />
    <CollectionListCard
      title="Collection Card in List"
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/q_auto,t_global/v1636016815/Singles/sticky_eng_ps00eg.png',
      }}
      onPress={() => {}}
    />
  </>
);

export const CollectionCards = () => (
  <ScreenWrapper>
    <CollectionCardsList />
  </ScreenWrapper>
);

export const AllCards = () => (
  <ScreenWrapper>
    <CardsList />
    <Spacer16 />
    <CardSmallsList />
    <Spacer16 />
    <CollectionCardsList />
  </ScreenWrapper>
);
