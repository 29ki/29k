import styled from 'styled-components';
import styledNative from 'styled-components/native';
import {COLORS} from '../../../../shared/src/constants/colors';
import LogoIcon from './LogoIcon';
import Logo29kIcon from './Logo29k';
import {Body16} from '../../../../client/src/lib/components/Typography/Body/Body';
import Markdown from '../../../../client/src/lib/components/Typography/Markdown/Markdown';
import {
  Spacer12,
  Spacer16,
  Spacer32,
  Spacer8,
} from '../../../../client/src/lib/components/Spacers/Spacer';
import {useTranslation} from 'react-i18next';
import AppStoreLogo from './AppStoreLogo';
import GooglePlayLogo from './GooglePlayLogo';
import Link from 'next/link';

const Wrapper = styled.footer({
  display: 'grid',
  padding: 32,
  background: COLORS.BLACK,
  '@media(min-width: 720px)': {
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    columnGap: 32,
  },
});

const Logos = styled.div({
  display: 'flex',

  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingBottom: 16,
  '@media(min-width: 720px)': {
    gridColumnStart: 1,
    gridColumnEnd: 5,
  },
});

const Logo = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const LogoAware = styled(LogoIcon)({
  width: 46,
  height: 46,
  fill: COLORS.WHITE,
});

const Logo29k = styled(Logo29kIcon)({
  width: 46,
  height: 46,
  fill: COLORS.WHITE,
});

const WhiteMarkdown = styled(Markdown).attrs({
  styles: {text: {color: COLORS.WHITE}, link: {color: COLORS.WHITE}},
})({});

const WhiteBody16 = styledNative(Body16)({
  color: COLORS.WHITE,
});

const DownloadLinks = styled.div({
  display: 'flex',
});

const DonwloadLink = styled(Link)({
  display: 'block',
  flex: 1,
});

const Footer = () => {
  const {t} = useTranslation('Web.Footer');
  return (
    <Wrapper>
      <Logos>
        <LogoAware />
        <Logo>
          <WhiteBody16>{t('madeBy')}</WhiteBody16>
          <Spacer8 />
          <Logo29k />
        </Logo>
      </Logos>
      <div>
        <WhiteMarkdown>{t('about__markdown')}</WhiteMarkdown>
        <Spacer16 />
        <DownloadLinks>
          <DonwloadLink
            href="https://apps.apple.com/app/id1631342681"
            title={t('downloadAppStore')}>
            <AppStoreLogo />
          </DonwloadLink>
          <Spacer12 />
          <DonwloadLink
            href="https://play.google.com/store/apps/details?id=org.twentyninek.app.cupcake"
            title={t('downloadGooglePlay')}>
            <GooglePlayLogo />
          </DonwloadLink>
        </DownloadLinks>
        <Spacer32 />
      </div>
      <div>
        <WhiteMarkdown>{t('moreInfo__markdown')}</WhiteMarkdown>
      </div>
    </Wrapper>
  );
};

export default Footer;
