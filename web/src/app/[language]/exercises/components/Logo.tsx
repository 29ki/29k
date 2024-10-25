import styled, {keyframes} from 'styled-components';
import LogoAware from './LogoAware';
import {Spacer8} from '../../../../../../client/src/lib/components/Spacers/Spacer';
import LogoIcon from './LogoIcon';

const Wrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const SpinningLogo = styled.div`
  height: 100%;
  aspect-ratio: 1/1;
  animation: ${rotate} 30s linear infinite;
`;

const Name = styled(LogoAware)({
  flex: 1,
});

const Logo = ({className}: {className?: string}) => (
  <Wrapper className={className}>
    <SpinningLogo>
      <LogoIcon />
    </SpinningLogo>
    <Spacer8 />
    <Name />
  </Wrapper>
);

export default Logo;
