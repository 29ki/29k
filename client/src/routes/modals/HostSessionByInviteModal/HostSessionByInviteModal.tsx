import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {View} from 'react-native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';

import Gutters from '../../../lib/components/Gutters/Gutters';

import Image from '../../../lib/components/Image/Image';
import SheetModal from '../../../lib/components/Modals/SheetModal';

import {
  ModalStackProps,
  AppStackProps,
} from '../../../lib/navigation/constants/routes';

import useExerciseById from '../../../lib/content/hooks/useExerciseById';

import {formatContentName} from '../../../lib/utils/string';

import {
  BottomSafeArea,
  Spacer16,
  Spacer32,
  Spacer4,
} from '../../../lib/components/Spacers/Spacer';
import {Display24} from '../../../lib/components/Typography/Display/Display';
import {Body16} from '../../../lib/components/Typography/Body/Body';
import Byline from '../../../lib/components/Bylines/Byline';

import SessionTimeBadge from '../../../lib/components/SessionTimeBadge/SessionTimeBadge';
import {COLORS} from '../../../../../shared/src/constants/colors';

import {SPACINGS} from '../../../lib/constants/spacings';
import Markdown from '../../../lib/components/Typography/Markdown/Markdown';
import Tag from '../../../lib/components/Tag/Tag';
import useGetSessionCardTags from '../../../lib/components/Cards/SessionCard/hooks/useGetSessionCardTags';
import {LiveSessionType} from '../../../../../shared/src/schemas/Session';
import {
  getSessionByHostingCode,
  acceptHostingInvite,
} from '../../../lib/sessions/api/session';
import Button from '../../../lib/components/Buttons/Button';
import useIsPublicHost from '../../../lib/user/hooks/useIsPublicHost';

const Content = styled(Gutters)({
  justifyContent: 'space-between',
});

const SpaceBetweenRow = styled(View)({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const Row = styled(View)({
  flexDirection: 'row',
  alignItems: 'flex-end',
});

const TitleContainer = styled.View({
  flex: 2,
});

const ImageContainer = styled(Image)({
  aspectRatio: '1',
  flex: 1,
  height: 90,
});

const Tags = styled(Gutters)({
  flexWrap: 'wrap',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: -SPACINGS.FOUR,
});

const HostSessionByInviteModal = () => {
  const {
    params: {hostingCode},
  } = useRoute<RouteProp<ModalStackProps, 'HostSessionByInviteModal'>>();

  const {t} = useTranslation('Modal.HostSessionByInvite');
  const isPublicHost = useIsPublicHost();
  const [session, setSession] = useState<LiveSessionType>();
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackProps & ModalStackProps>>();

  const fetchSession = useCallback(async () => {
    try {
      return getSessionByHostingCode(hostingCode);
    } catch (err) {
      navigation.navigate('SessionUnavailableModal');
    }
  }, [hostingCode, navigation]);

  useEffect(() => {
    if (!isPublicHost) {
      navigation.navigate('HostingInviteFailModal', {
        hostName: session?.hostProfile?.displayName,
      });
    }
  }, [isPublicHost, navigation, session?.hostProfile?.displayName]);

  useEffect(() => {
    (async () => setSession(await fetchSession()))();
  }, [fetchSession]);

  const exercise = useExerciseById(session?.exerciseId);
  const tags = useGetSessionCardTags(exercise);

  const acceptInvite = useCallback(async () => {
    if (session?.id) {
      await acceptHostingInvite(session.id, hostingCode);
      const updatedSession = await fetchSession();
      navigation.navigate('SessionModal', {
        session: updatedSession as LiveSessionType,
      });
    }
  }, [session?.id, hostingCode, fetchSession, navigation]);
  const onCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  if (!session || !exercise) {
    return null;
  }

  return (
    <SheetModal backgroundColor={COLORS.CREAM}>
      <BottomSheetScrollView focusHook={useIsFocused}>
        <Spacer16 />

        <Content>
          <SpaceBetweenRow>
            <TitleContainer>
              <Display24>{formatContentName(exercise)}</Display24>
              <Spacer4 />
              <Row>
                <Byline
                  pictureURL={session.hostProfile?.photoURL}
                  name={session.hostProfile?.displayName}
                />
              </Row>
            </TitleContainer>
            <Spacer32 />
            <ImageContainer
              resizeMode="contain"
              source={{uri: exercise?.card?.image?.source}}
            />
          </SpaceBetweenRow>
        </Content>
        {exercise?.description && (
          <>
            <Spacer16 />
            <Gutters>
              <Markdown>{exercise?.description}</Markdown>
            </Gutters>
          </>
        )}

        {tags && (
          <Tags>
            {tags.map((tag, idx) => (
              <Fragment key={`tag-${idx}`}>
                <Tag>{tag}</Tag>
                <Spacer4 />
              </Fragment>
            ))}
          </Tags>
        )}
        <Spacer16 />

        <Gutters>
          <Row>
            <SessionTimeBadge session={session} />
          </Row>
          <Spacer16 />
        </Gutters>

        <Gutters>
          <Body16>{t('description')}</Body16>
          <Spacer16 />
          <Row>
            <Button variant={'secondary'} onPress={acceptInvite}>
              {t('confirm')}
            </Button>
            <Spacer16 />
            <Button onPress={onCancel}>{t('cancel')}</Button>
          </Row>
        </Gutters>
        <BottomSafeArea minSize={SPACINGS.THIRTYTWO} />
      </BottomSheetScrollView>
    </SheetModal>
  );
};

export default HostSessionByInviteModal;
