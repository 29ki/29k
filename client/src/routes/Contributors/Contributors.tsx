import React from 'react';
import {Linking, ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {contributors} from '../../../../content/content.json';
import Gutters from '../../common/components/Gutters/Gutters';
import {
  BottomSafeArea,
  Spacer16,
  Spacer32,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import TouchableOpacity from '../../common/components/TouchableOpacity/TouchableOpacity';
import {Body14} from '../../common/components/Typography/Body/Body';
import {Heading24} from '../../common/components/Typography/Heading/Heading';
import {SPACINGS} from '../../common/constants/spacings';

type Contributor = {
  name: string;
  avatar_url: string;
  profile: string;
  contributions: string[];
};

const ContributorWrapper = styled(TouchableOpacity)({
  width: '33%',
  padding: SPACINGS.EIGHT,
});

const Avatar = styled.Image({
  width: '100%',
  borderRadius: 100,
  aspectRatio: '1',
  overflow: 'hidden',
});

const Name = styled(Body14)({
  textAlign: 'center',
});

const Contributor: React.FC<{contributor: Contributor}> = ({contributor}) => (
  <ContributorWrapper onPress={() => Linking.openURL(contributor.profile)}>
    <Avatar source={{uri: contributor.avatar_url}} />
    <Spacer16 />
    <Name>{contributor.name}</Name>
  </ContributorWrapper>
);

const ContributorsList = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
});

const Contributors = () => (
  <ScrollView>
    <Gutters>
      <TopSafeArea />
      <Heading24>Core team</Heading24>
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
      <Heading24>Contributors</Heading24>
      <Spacer16 />
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
    </Gutters>
  </ScrollView>
);

export default Contributors;
