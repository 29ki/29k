import styled from 'styled-components';
import {COLORS} from '../../../../shared/src/constants/colors';
import LogoIcon from './LogoIcon';
import Logo29kIcon from './Logo29k';

const Wrapper = styled.footer({
  display: 'grid',
  padding: 32,
  background: COLORS.BLACK,
  '@media(min-width: 720px)': {
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    columnGap: 32,
  },
});

const Logo = styled(LogoIcon)({
  width: 46,
  height: 46,
  fill: COLORS.WHITE,
});

const Logo29k = styled(Logo29kIcon)({
  width: 46,
  height: 46,
  fill: COLORS.WHITE,
});

const Footer = () => {
  return (
    <Wrapper>
      <div>
        <Logo />
      </div>
      <div>Footer</div>
      <div>Footer</div>
      <div>
        <Logo29k />
      </div>
    </Wrapper>
  );
};

export default Footer;
