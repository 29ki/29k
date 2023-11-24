import React, {useCallback, useMemo, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation, useScrollToTop} from '@react-navigation/native';

import {SPACINGS} from '../../../lib/constants/spacings';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {
  ModalStackProps,
  OverlayStackProps,
} from '../../../lib/navigation/constants/routes';
import SETTINGS from '../../../lib/constants/settings';
import {
  Spacer12,
  Spacer16,
  TopSafeArea,
} from '../../../lib/components/Spacers/Spacer';
import Button from '../../../lib/components/Buttons/Button';
import {PlusIcon} from '../../../lib/components/Icons';
import Screen from '../../../lib/components/Screen/Screen';
import {Heading16} from '../../../lib/components/Typography/Heading/Heading';
import StickyHeading from '../../../lib/components/StickyHeading/StickyHeading';
import TopBar from '../../../lib/components/TopBar/TopBar';
import MiniProfile from '../../../lib/components/MiniProfile/MiniProfile';
import BottomFade from '../../../lib/components/BottomFade/BottomFade';
import SharingPosts from './components/SharingPosts';
import AutoScrollView from '../../../lib/components/AutoScrollView/AutoScrollView';
import LiveSessions from './components/LiveSessions';
import {Body16, BodyLink} from '../../../lib/components/Typography/Body/Body';
import useSessions from '../../../lib/sessions/hooks/useSessions';
import useSharingPosts from '../../../lib/posts/hooks/useSharingPosts';
import useThrottledFocusEffect from '../../../lib/navigation/hooks/useThrottledFocusEffect';
import TouchableOpacity from '../../../lib/components/TouchableOpacity/TouchableOpacity';
import useRecommendedSessions from '../../../lib/sessions/hooks/useRecommendedSessions';
import RecommendedSessions from './components/RecommendedSessions';
import WelcomeBanner from './components/WelcomeBanner';

const AddButton = styled(Button)({
  alignSelf: 'center',
  ...SETTINGS.BOXSHADOW,
});

const AddSessionWrapper = styled.View({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
});

const AddSessionForm = () => {
  const {t} = useTranslation('Screen.Home');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();

  return (
    <AddSessionWrapper>
      <AddButton
        onPress={() => navigate('CreateSessionModal', {exerciseId: undefined})}
        LeftIcon={PlusIcon}>
        {t('add')}
      </AddButton>
      <Spacer12 />
    </AddSessionWrapper>
  );
};

/*
const GetStarted = () => {
  const {pinnedCollections} = usePinnedCollections();
  const {getStartedCollection} = useGetStartedCollection();
  const {completedCollectionEvents} = useUserEvents();

  const getStarted = useMemo(() => {
    const collection = pinnedCollections.find(
      p => p.id === getStartedCollection?.id,
    );
    if (
      collection &&
      !completedCollectionEvents.find(
        c => c.payload.id === getStartedCollection?.id,
      )
    ) {
      return collection;
    }
    return null;
  }, [pinnedCollections, getStartedCollection, completedCollectionEvents]);

  if (getStarted) {
    return (
      <Gutters>
        <Spacer24 />
        <CollectionCardContainer collectionId={getStarted.id} />
      </Gutters>
    );
  }
  return <Spacer24 />;
};
*/

const Home = () => {
  const {t} = useTranslation('Screen.Home');
  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<OverlayStackProps & ModalStackProps>
    >();
  const scrollRef = useRef(null);
  const recommendedSessions = useRecommendedSessions();
  const {fetchSessions, sessions} = useSessions();
  const {fetchSharingPosts, sharingPosts} = useSharingPosts();

  const otherSessions = useMemo(
    // Filter out recommended sessions
    () => sessions.filter(session => !recommendedSessions.includes(session)),
    [sessions, recommendedSessions],
  );

  const fetch = useCallback(() => {
    fetchSessions();
    fetchSharingPosts();
  }, [fetchSessions, fetchSharingPosts]);

  useThrottledFocusEffect(fetch, 10000);

  useScrollToTop(scrollRef);

  const onPressEllipsis = useCallback(() => {
    navigate('AboutOverlay');
  }, [navigate]);

  const onPressLiveSessions = useCallback(() => {
    navigate('LiveSessionsModal');
  }, [navigate]);

  return (
    <Screen backgroundColor={COLORS.PURE_WHITE}>
      <TopSafeArea minSize={SPACINGS.SIXTEEN} />
      <TopBar
        backgroundColor={COLORS.PURE_WHITE}
        onPressEllipsis={onPressEllipsis}>
        <MiniProfile />
      </TopBar>
      <AutoScrollView ref={scrollRef} stickyHeaderIndices={[1, 3, 5]}>
        <WelcomeBanner />
        {recommendedSessions.length > 0 && (
          <StickyHeading>
            <Heading16>{t('sections.forYou')}</Heading16>
          </StickyHeading>
        )}
        {recommendedSessions.length > 0 && (
          <>
            <RecommendedSessions sessions={recommendedSessions} />
            <Spacer16 />
          </>
        )}
        {otherSessions.length > 0 && (
          <StickyHeading>
            <Heading16>{t('sections.liveSessions')}</Heading16>
            <TouchableOpacity onPress={onPressLiveSessions}>
              <Body16>
                <BodyLink>{t('seeAll')}</BodyLink>
              </Body16>
            </TouchableOpacity>
          </StickyHeading>
        )}
        {otherSessions.length > 0 && (
          <>
            <LiveSessions sessions={otherSessions} />
            <Spacer16 />
          </>
        )}
        {sharingPosts.length > 0 && (
          <StickyHeading>
            <Heading16>{t('sections.sharingPosts')}</Heading16>
          </StickyHeading>
        )}
        {sharingPosts.length > 0 && (
          <>
            <SharingPosts sharingPosts={sharingPosts} />
            <Spacer16 />
          </>
        )}
      </AutoScrollView>
      <BottomFade />
      <AddSessionForm />
    </Screen>
  );
};

export default Home;
