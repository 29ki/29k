import React, {useEffect, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import SheetModal from '../../../lib/components/Modals/SheetModal';
import {BottomSafeArea, Spacer16} from '../../../lib/components/Spacers/Spacer';
import {
  Heading16,
  ModalHeading,
} from '../../../lib/components/Typography/Heading/Heading';
import {BottomSheetSectionList} from '@gorhom/bottom-sheet';
import useSessions from '../../../lib/sessions/hooks/useSessions';
import useGetRelativeDateGroup from '../../../lib/date/hooks/useGetRelativeDateGroup';
import dayjs from 'dayjs';
import {groupBy} from 'ramda';
import {LiveSessionType} from '../../../../../shared/src/schemas/Session';
import SessionCard from '../../../lib/components/Cards/SessionCard/SessionCard';
import Gutters from '../../../lib/components/Gutters/Gutters';
import StickyHeading from '../../../lib/components/StickyHeading/StickyHeading';
import {SectionListRenderItem} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import BottomFade from '../../../lib/components/BottomFade/BottomFade';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../lib/constants/spacings';

type Section = {
  title: string;
  data: LiveSessionType[];
  type: 'hostedBy' | 'interested' | 'comming';
};

const renderSectionHeader: (info: {section: Section}) => React.ReactElement = ({
  section: {title},
}) => (
  <StickyHeading>
    <Heading16>{title}</Heading16>
  </StickyHeading>
);

const renderSectionItem: SectionListRenderItem<LiveSessionType, Section> = ({
  item,
  section,
  index,
}) => (
  <Gutters>
    <SessionCard
      session={item}
      small={
        section.type !== 'comming' && section.data.length >= 1 && index > 0
      }
    />
  </Gutters>
);

const LiveSessionsModal = () => {
  const {t} = useTranslation('Modal.LiveSessions');
  const {fetchSessions, sessions, pinnedSessions, hostedSessions} =
    useSessions();
  const getRelativeDateGroup = useGetRelativeDateGroup();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const sections = useMemo(() => {
    let sectionsList: Section[] = [];

    if (hostedSessions.length > 0) {
      sectionsList.push({
        title: t('sections.hostedBy'),
        data: hostedSessions,
        type: 'hostedBy',
      });
    }
    if (pinnedSessions.length > 0) {
      sectionsList.push({
        title: t('sections.interested'),
        data: pinnedSessions,
        type: 'interested',
      });
    }

    if (sessions.length > 0) {
      Object.entries(
        groupBy(
          session => getRelativeDateGroup(dayjs(session.startTime)),
          sessions,
        ),
      ).forEach(([group, items = []]) => {
        sectionsList.push({
          title: group,
          data: items,
          type: 'comming',
        });
      });
    }

    return sectionsList;
  }, [sessions, pinnedSessions, hostedSessions, t, getRelativeDateGroup]);

  return (
    <SheetModal backgroundColor={COLORS.PURE_WHITE}>
      <ModalHeading>{t('title')}</ModalHeading>
      <Spacer16 />
      <BottomSheetSectionList
        sections={sections}
        ItemSeparatorComponent={Spacer16}
        stickySectionHeadersEnabled
        renderSectionHeader={renderSectionHeader}
        renderItem={renderSectionItem}
        ListFooterComponent={<BottomSafeArea minSize={SPACINGS.THIRTYTWO} />}
        focusHook={useIsFocused}
      />
      <BottomFade color={COLORS.PURE_WHITE} />
    </SheetModal>
  );
};

export default LiveSessionsModal;
