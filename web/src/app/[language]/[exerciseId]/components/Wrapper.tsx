import styled from 'styled-components/native';
import {COLORS} from '../../../../../../shared/src/constants/colors';

const Background = styled.View<{backgroundColor?: string}>(
  ({backgroundColor}) => ({
    position: 'relative',
    minHeight: '100%',
    width: '100%',
    backgroundColor: backgroundColor ?? COLORS.WHITE,
  }),
);

const Container = styled.View({
  minHeight: '100%',
  width: '100%',
  maxWidth: 800,
  marginHorizontal: 'auto',
});

const Wrapper = ({
  backgroundColor,
  children,
}: {
  backgroundColor?: string;
  children: React.ReactNode;
}) => (
  <Background backgroundColor={backgroundColor}>
    <Container>{children}</Container>
  </Background>
);

export default Wrapper;
