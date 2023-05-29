import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Picker} from '@react-native-picker/picker';

import Gutters from '../../../lib/components/Gutters/Gutters';
import SheetModal from '../../../lib/components/Modals/SheetModal';
import {
  Spacer24,
  Spacer32,
  Spacer8,
} from '../../../lib/components/Spacers/Spacer';
import {ModalHeading} from '../../../lib/components/Typography/Heading/Heading';
import useSessionReminderNotificationsSetting from '../../../lib/notifications/hooks/useSessionReminderNotificationsSetting';
import ActionSwitch from '../../../lib/components/ActionList/ActionItems/ActionSwitch';
import {BellIcon} from '../../../lib/components/Icons';
import ActionList from '../../../lib/components/ActionList/ActionList';
import {Body16, BodyBold} from '../../../lib/components/Typography/Body/Body';
import usePracticeReminderNotificationsSetting from '../../../lib/notifications/hooks/usePracticeReminderNotificationsSetting';
import ActionItem from '../../../lib/components/ActionList/ActionItem';
import styled from 'styled-components/native';
import TouchableOpacity from '../../../lib/components/TouchableOpacity/TouchableOpacity';
import {SPACINGS} from '../../../lib/constants/spacings';

enum IntervalEnum {
  'everyDay' = 'everyDay',
  'monday' = 'monday',
  'tuseday' = 'tusday',
  'wednesday' = 'wednesday',
  'thursday' = 'thursday',
  'friday' = 'friday',
  'saturday' = 'saturday',
  'sunday' = 'sudnay',
}

const PracticeActionWrapper = styled(TouchableOpacity)({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: SPACINGS.SIXTEEN,
});

const StyledBold = styled(BodyBold)({fontSize: 16});

const RemindersModal = () => {
  const {t} = useTranslation('Modal.Reminders');
  const [weekdayOpen, setWeekdayOpen] = useState();
  const {remindersEnabled, setRemindersEnabled} =
    useSessionReminderNotificationsSetting();
  const {
    practiceReminderConfig,
    practiceRemindersEnabled,
    setPracticeRemindersEnabled,
  } = usePracticeReminderNotificationsSetting();

  return (
    <SheetModal>
      <Gutters>
        <ModalHeading>{t('title')}</ModalHeading>
        <Spacer24 />
        <ActionList>
          <ActionSwitch
            Icon={BellIcon}
            onValueChange={setRemindersEnabled}
            value={remindersEnabled}>
            {t('actions.sessionReminders')}
          </ActionSwitch>
        </ActionList>
        <Spacer8 />
        <Body16>{t('sessionRemindersText')}</Body16>
        <Spacer32 />
        <ActionList>
          <ActionSwitch
            Icon={BellIcon}
            onValueChange={setRemindersEnabled}
            value={remindersEnabled}>
            {t('actions.practiceReminders')}
          </ActionSwitch>
        </ActionList>
        <Spacer32 />
        {!practiceRemindersEnabled && (
          <>
            <ActionList>
              <ActionItem>
                <PracticeActionWrapper>
                  <StyledBold>{t('weekday')}</StyledBold>
                  <Body16>{'Weekday'}</Body16>
                </PracticeActionWrapper>
              </ActionItem>
              <ActionItem>
                <PracticeActionWrapper>
                  <StyledBold>{t('time')}</StyledBold>
                  <Body16>{'Weekday'}</Body16>
                </PracticeActionWrapper>
              </ActionItem>
            </ActionList>
          </>
        )}

        <Picker selectedValue="monday">
          {Object.keys(IntervalEnum).map(interval => (
            <Picker.Item
              key={interval}
              value={interval}
              label={t(`intervals.${interval}`)}
            />
          ))}
        </Picker>
      </Gutters>
    </SheetModal>
  );
};

export default RemindersModal;
