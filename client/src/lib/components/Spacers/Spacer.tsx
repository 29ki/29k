import React from 'react';
import styled from 'styled-components/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SPACINGS} from '../../constants/spacings';

type Spacer = {
  size: number;
};

const Spacer = styled.View<Spacer>(({size}) => ({
  flex: 0,
  overflow: 'visible',
  zIndex: 1,
  flexBasis: size,
  minHeight: size,
  minWidth: size,
}));

export const Spacer4: React.FC = props => (
  <Spacer {...props} size={SPACINGS.FOUR} />
);
export const Spacer8: React.FC = props => (
  <Spacer {...props} size={SPACINGS.EIGHT} />
);
export const Spacer12: React.FC = props => (
  <Spacer {...props} size={SPACINGS.TWELVE} />
);
export const Spacer16: React.FC = props => (
  <Spacer {...props} size={SPACINGS.SIXTEEN} />
);
export const Spacer20: React.FC = props => (
  <Spacer {...props} size={SPACINGS.TWENTY} />
);
export const Spacer24: React.FC = props => (
  <Spacer {...props} size={SPACINGS.TWENTYFOUR} />
);
export const Spacer28: React.FC = props => (
  <Spacer {...props} size={SPACINGS.TWENTYEIGHT} />
);
export const Spacer32: React.FC = props => (
  <Spacer {...props} size={SPACINGS.THIRTYTWO} />
);
export const Spacer40: React.FC = props => (
  <Spacer {...props} size={SPACINGS.FOURTY} />
);
export const Spacer48: React.FC = props => (
  <Spacer {...props} size={SPACINGS.FOURTYEIGHT} />
);
export const Spacer60: React.FC = props => (
  <Spacer {...props} size={SPACINGS.SIXTY} />
);
export const Spacer96: React.FC = props => (
  <Spacer {...props} size={SPACINGS.NINTYSIX} />
);

export const TopSafeArea = ({minSize = 0}) => (
  <Spacer size={Math.max(useSafeAreaInsets().top, minSize)} />
);
export const BottomSafeArea = ({minSize = 0}) => (
  <Spacer size={Math.max(useSafeAreaInsets().bottom, minSize)} />
);
