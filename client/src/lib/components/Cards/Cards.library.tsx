import React from 'react';
import styled from 'styled-components/native';

import ScreenWrapper from '../../uiLib/decorators/ScreenWrapper';
import Badge from '../Badge/Badge';
import {CommunityIcon, FriendsIcon} from '../Icons';
import {Spacer16, Spacer4, Spacer8} from '../Spacers/Spacer';
import {Body14, BodyBold} from '../Typography/Body/Body';
import Card from './Card';
import CollectionFullCard from './CollectionCards/CollectionFullCard';
import CollectionListCard from './CollectionCards/CollectionListCard';
import ExerciseWalletCard from './WalletCards/ExerciseWalletCard';
import SessionWalletCard from './WalletCards/SessionWalletCard';
import {UserProfileType} from '../../../../../shared/src/schemas/User';
import {ExerciseCard} from '../../../../../shared/src/types/generated/Exercise';
import Button from '../Buttons/Button';

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'flex-end',
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

export const AllCards = () => (
  <ScreenWrapper>
    <Card
      title="Pure Simple Love"
      tags={DUMMY_TAGS}
      hostProfile={DUMMY_HOST}
      graphic={DUMMY_TRANSPARENT_IMAGE_GRAPHIC}
      onPress={() => {}}>
      <Row>
        <Body14>Starts</Body14>
        <Spacer4 />
        <Badge text="09:00" IconAfter={<CommunityIcon />} />
      </Row>
    </Card>
    <Spacer16 />
    <Card
      title="Accepting thoughts and feelings"
      tags={DUMMY_TAGS}
      hostProfile={DUMMY_HOST}
      graphic={DUMMY_TRANSPARENT_LOTTIE_GRAPHIC}
      onPress={() => {}}>
      <Row>
        <Button size="small" variant="secondary" onPress={() => {}}>
          <BodyBold>Join</BodyBold>
        </Button>
        <Spacer8 />
        <Badge text="Shortly" IconAfter={<FriendsIcon />} />
      </Row>
    </Card>
    <Spacer16 />
    <Card
      title="Accepting thoughts and feeeeeeeeeeeeeelings"
      tags={DUMMY_TAGS}
      hostProfile={DUMMY_HOST}
      graphic={DUMMY_IMAGE_GRAPHIC}
      isPinned
      onPress={() => {}}>
      <Row>
        <Body14>Starts</Body14>
        <Spacer4 />
        <Badge text="Mon, 7 Sep 17.30" IconAfter={<CommunityIcon />} />
      </Row>
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
      <Row>
        <Body14>Starts</Body14>
        <Spacer4 />
        <Badge text="Mon, 7 Sep 17.30" IconAfter={<CommunityIcon />} />
      </Row>
    </Card>
    <Spacer16 />
    <Card
      title="Accepting thoughts and feelings"
      tags={DUMMY_TAGS}
      hostProfile={DUMMY_HOST}
      graphic={DUMMY_IMAGE_GRAPHIC}
      interestedCount={3}
      onPress={() => {}}>
      <Row>
        <Body14>Starts</Body14>
        <Spacer4 />
        <Badge text="Mon, 7 Sep 17.30" IconAfter={<CommunityIcon />} />
      </Row>
    </Card>
    <Spacer16 />
    <SessionWalletCard
      hasCardAfter={false}
      hasCardBefore={false}
      title="Private session starts soon"
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/q_auto,t_global/v1636016815/Singles/sticky_eng_ps00eg.png',
      }}
      hostPictureURL="https://res.cloudinary.com/twentyninek/image/upload/q_auto,t_global/v1636016815/Singles/sticky_eng_ps00eg.png"
      hostName="Jenny"
      onPress={() => {}}>
      <Row>
        <Badge text="03:43s" />
      </Row>
    </SessionWalletCard>
    <Spacer16 />
    <ExerciseWalletCard
      hasCardAfter={false}
      hasCardBefore={false}
      title="Some exercise name"
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/q_auto,t_global/v1636016815/Singles/sticky_eng_ps00eg.png',
      }}
      onPress={() => {}}
    />
    <Spacer16 />
    <ExerciseWalletCard
      hasCardAfter={true}
      hasCardBefore={false}
      title="First in wallet"
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/q_auto,t_global/v1636016815/Singles/sticky_eng_ps00eg.png',
      }}
      onPress={() => {}}
    />
    <ExerciseWalletCard
      hasCardAfter={false}
      hasCardBefore={true}
      title="Last in wallet"
      image={{
        uri: 'https://res.cloudinary.com/twentyninek/image/upload/q_auto,t_global/v1636016815/Singles/sticky_eng_ps00eg.png',
      }}
      onPress={() => {}}
    />
    <Spacer16 />
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
  </ScreenWrapper>
);
