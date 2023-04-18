import React, {useCallback, useEffect, useState} from 'react';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

import SheetModal from '../../../lib/components/Modals/SheetModal';
import ProfilePicture from '../../../lib/components/User/ProfilePicture';
import {
  AppStackProps,
  ModalStackProps,
} from '../../../lib/navigation/constants/routes';
import {
  Spacer16,
  Spacer32,
  Spacer4,
} from '../../../lib/components/Spacers/Spacer';
import {
  Heading18,
  Heading24,
} from '../../../lib/components/Typography/Heading/Heading';
import Gutters from '../../../lib/components/Gutters/Gutters';
import {Body16, Body18} from '../../../lib/components/Typography/Body/Body';
import {useTranslation} from 'react-i18next';
import {fetchSessions} from '../../../lib/sessions/api/sessions';
import {LiveSession} from '../../../../../shared/src/types/Session';
import {ActivityIndicator, ListRenderItem} from 'react-native';
import SessionCard from '../../../lib/components/Cards/SessionCard/SessionCard';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {
  Display18,
  Display28,
} from '../../../lib/components/Typography/Display/Display';
import {SPACINGS} from '../../../lib/constants/spacings';
import {CommunityIcon, FriendsIcon} from '../../../lib/components/Icons';

const EmptyListContainer = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
});

const Spinner = styled(ActivityIndicator)({
  marginRight: -SPACINGS.EIGHT,
  marginLeft: SPACINGS.EIGHT,
});

const Picture = styled(ProfilePicture)({
  width: 144,
  alignSelf: 'center',
});

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const TextRow = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const CountContainer = styled.View({
  backgroundColor: COLORS.MEDIUM_GREEN,
  borderRadius: 16,
  padding: SPACINGS.EIGHT,
  flex: 1,
  minHeight: SPACINGS.NINTYSIX,
});

const IconWrapper = styled.View({
  width: 30,
  height: 30,
});

const HostInfoModal: React.FC = () => {
  const {
    params: {host},
  } = useRoute<RouteProp<ModalStackProps, 'HostInfoModal'>>();
  const {t} = useTranslation('Modal.HostInfo');
  const {popToTop} =
    useNavigation<NativeStackNavigationProp<AppStackProps & ModalStackProps>>();
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<Array<LiveSession>>([]);

  useEffect(() => {
    if (host?.uid) {
      setIsLoading(true);
      fetchSessions(undefined, host?.uid)
        .then(setSessions)
        .finally(() => setIsLoading(false));
    }
  }, [setSessions, setIsLoading, host?.uid]);

  const renderSession = useCallback<ListRenderItem<LiveSession>>(
    data => {
      return (
        <Gutters>
          <SessionCard
            hasCardAfter={false}
            hasCardBefore={false}
            session={data.item}
            standAlone
            disableHostPress
            onBeforeContextPress={popToTop}
          />
          <Spacer16 />
        </Gutters>
      );
    },
    [popToTop],
  );

  return (
    <SheetModal>
      <BottomSheetFlatList
        data={sessions}
        keyExtractor={s => s.id}
        ListEmptyComponent={
          <EmptyListContainer>
            {isLoading ? (
              <Spinner color={COLORS.BLACK} />
            ) : (
              <Display18>{t('noUpcomingSessions')}</Display18>
            )}
          </EmptyListContainer>
        }
        ListHeaderComponent={
          <Gutters>
            <Spacer16 />
            <Picture
              pictureURL={host?.photoURL}
              letter={host?.displayName?.[0]}
            />
            <Spacer32 />
            <Heading24>{host?.displayName}</Heading24>
            <Spacer16 />
            <Body18>{host?.description}</Body18>
            <Spacer32 />
            <Row>
              <CountContainer>
                <TextRow>
                  <IconWrapper>
                    <CommunityIcon />
                  </IconWrapper>
                  <Display28>{host?.hostedPublicCount ?? 0}</Display28>
                </TextRow>
                <Spacer4 />
                <Body16>{t('publicSessions')}</Body16>
              </CountContainer>
              <Spacer16 />
              <CountContainer>
                <TextRow>
                  <IconWrapper>
                    <FriendsIcon />
                  </IconWrapper>
                  <Display28>{host?.hostedPrivateCount ?? 0}</Display28>
                </TextRow>
                <Spacer4 />
                <Body16>{t('privateSessions')}</Body16>
              </CountContainer>
            </Row>
            <Spacer32 />
            <Heading18>{t('sessions')}</Heading18>
            <Spacer16 />
          </Gutters>
        }
        renderItem={renderSession}
      />
    </SheetModal>
  );
};

export default HostInfoModal;
