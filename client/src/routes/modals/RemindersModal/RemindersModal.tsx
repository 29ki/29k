import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Picker} from '@react-native-picker/picker';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {useIsFocused} from '@react-navigation/native';

import Gutters from '../../../lib/components/Gutters/Gutters';
import SheetModal from '../../../lib/components/Modals/SheetModal';
import {
  Spacer24,
  Spacer32,
  Spacer8,
} from '../../../lib/components/Spacers/Spacer';
import {ModalHeading} from '../../../lib/components/Typography/Heading/Heading';
import useSessionReminderNotificationsSetting from '../../../lib/reminders/hooks/useSessionReminderNotificationsSetting';
import usePracticeReminderNotificationsSetting from '../../../lib/reminders/hooks/usePracticeReminderNotificationsSetting';
import ActionSwitch from '../../../lib/components/ActionList/ActionItems/ActionSwitch';
import {BellIcon} from '../../../lib/components/Icons';
import ActionList from '../../../lib/components/ActionList/ActionList';
import {Body16, BodyBold} from '../../../lib/components/Typography/Body/Body';
import ActionItem from '../../../lib/components/ActionList/ActionItem';
import styled from 'styled-components/native';
import TouchableOpacity from '../../../lib/components/TouchableOpacity/TouchableOpacity';
import {SPACINGS} from '../../../lib/constants/spacings';
import {DateTimePicker} from '../../../lib/components/DateTimePicker/DateTimePicker';
import {BottomSheetScrollView, useBottomSheet} from '@gorhom/bottom-sheet';
import {COLORS} from '../../../../../shared/src/constants/colors';
import Button from '../../../lib/components/Buttons/Button';
import {REMINDER_INTERVALS} from '../../../lib/reminders/constants';

dayjs.extend(utc);

const PracticeActionWrapper = styled(TouchableOpacity)({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: SPACINGS.SIXTEEN,
});

const StyledBold = styled(BodyBold)({fontSize: 16});

const StyledSelectedValue = styled(Body16)<{active?: boolean}>(({active}) => ({
  color: active ? COLORS.PRIMARY : undefined,
}));

const ButtonWrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'flex-start',
});

const UpdateButton = styled(Button)({
  alignSelf: 'center',
});

const nextHalfHour = (): [number, number] => {
  const now = dayjs().utc();
  if (now.minute() === 30) {
    return [now.hour(), now.minute()];
  }
  if (now.minute() < 30) {
    return [now.hour(), 30];
  }

  const time = now.add(1, 'hour');
  return [time.hour(), 0];
};

const thisWeekday = (): REMINDER_INTERVALS => {
  return Object.keys(REMINDER_INTERVALS)[
    dayjs().isoWeekday()
  ] as REMINDER_INTERVALS;
};

const RemindersModal = () => {
  const {t} = useTranslation('Modal.Reminders');
  const {sessionRemindersEnabled, setSessionRemindersEnabled} =
    useSessionReminderNotificationsSetting();
  const {snapToIndex} = useBottomSheet();
  const [weekdayOpen, setWeekdayOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    practiceReminderConfig,
    practiceRemindersEnabled,
    setPracticeRemindersConfig,
  } = usePracticeReminderNotificationsSetting();
  const [selectedInterval, setSelectedInterval] = useState(
    practiceReminderConfig ? practiceReminderConfig.interval : thisWeekday(),
  );
  const [thisHour, closestHalfhour] = nextHalfHour();
  const [selectedTime, setSelectedTime] = useState(
    practiceReminderConfig
      ? dayjs()
          .set('hour', practiceReminderConfig.hour)
          .set('minute', practiceReminderConfig.minute)
      : dayjs().set('hour', thisHour).set('minute', closestHalfhour),
  );

  useEffect(() => {
    if (!timeOpen && !weekdayOpen) {
      snapToIndex(0);
    }
  }, [timeOpen, weekdayOpen, snapToIndex]);

  const reminderUpdated = useMemo(() => {
    return (
      practiceReminderConfig?.interval !== selectedInterval ||
      practiceReminderConfig?.hour !== selectedTime.hour() ||
      practiceReminderConfig?.minute !== selectedTime.minute()
    );
  }, [practiceReminderConfig, selectedInterval, selectedTime]);

  const toggleWeekday = useCallback(() => {
    snapToIndex(2);
    setTimeOpen(false);
    setWeekdayOpen(state => !state);
  }, [snapToIndex, setWeekdayOpen, setTimeOpen]);

  const toggleTime = useCallback(() => {
    snapToIndex(2);
    setWeekdayOpen(false);
    setTimeOpen(state => !state);
  }, [snapToIndex, setTimeOpen, setWeekdayOpen]);

  const onTogglePracticeReminders = useCallback(
    (value: boolean) => {
      if (value) {
        const [hour, minute] = nextHalfHour();
        const interval = thisWeekday();
        setSelectedInterval(interval);
        setSelectedTime(dayjs().utc().set('hour', hour).set('minute', minute));

        setPracticeRemindersConfig({
          interval,
          hour,
          minute,
        });
      } else {
        setPracticeRemindersConfig(null);
      }
    },
    [setPracticeRemindersConfig, setSelectedInterval, setSelectedTime],
  );

  const onUpdateReminder = useCallback(async () => {
    setIsLoading(true);
    setWeekdayOpen(false);
    setTimeOpen(false);

    try {
      await setPracticeRemindersConfig({
        interval: selectedInterval,
        hour: selectedTime.hour(),
        minute: selectedTime.minute(),
      });
    } finally {
      setIsLoading(false);
    }

    snapToIndex(0);
  }, [
    setIsLoading,
    setPracticeRemindersConfig,
    setWeekdayOpen,
    setTimeOpen,
    selectedInterval,
    selectedTime,
    snapToIndex,
  ]);

  const onSelectedInterval = useCallback(
    (interval: REMINDER_INTERVALS) => {
      setSelectedInterval(interval);
    },
    [setSelectedInterval],
  );

  const onSelectedTime = useCallback(
    (value: dayjs.Dayjs) => {
      setSelectedTime(value);
    },
    [setSelectedTime],
  );

  return (
    <SheetModal>
      <BottomSheetScrollView focusHook={useIsFocused}>
        <Gutters>
          <ModalHeading>{t('title')}</ModalHeading>
          <Spacer24 />
          <ActionList>
            <ActionSwitch
              Icon={BellIcon}
              onValueChange={setSessionRemindersEnabled}
              value={sessionRemindersEnabled}>
              {t('actions.sessionReminders')}
            </ActionSwitch>
          </ActionList>
          <Spacer8 />
          <Body16>{t('sessionRemindersText')}</Body16>
          <Spacer32 />
          <ActionList>
            <ActionSwitch
              Icon={BellIcon}
              onValueChange={onTogglePracticeReminders}
              value={practiceRemindersEnabled}>
              {t('actions.practiceReminders')}
            </ActionSwitch>
          </ActionList>
          <Spacer32 />
          {practiceRemindersEnabled && (
            <>
              <ActionList>
                <ActionItem hideBorder>
                  <PracticeActionWrapper onPress={toggleWeekday}>
                    <StyledBold>{t('weekday')}</StyledBold>
                    <StyledSelectedValue active={weekdayOpen}>
                      {t(`intervals.${selectedInterval}`)}
                    </StyledSelectedValue>
                  </PracticeActionWrapper>
                </ActionItem>
                {weekdayOpen && (
                  <Picker
                    onValueChange={onSelectedInterval}
                    selectedValue={selectedInterval}>
                    {Object.keys(REMINDER_INTERVALS).map(interval => (
                      <Picker.Item
                        key={interval}
                        value={interval}
                        label={t(`intervals.${interval}`)}
                      />
                    ))}
                  </Picker>
                )}
                <ActionItem hideBorder>
                  <PracticeActionWrapper onPress={toggleTime}>
                    <StyledBold>{t('time')}</StyledBold>
                    <StyledSelectedValue active={timeOpen}>
                      {selectedTime.local().format('LT')}
                    </StyledSelectedValue>
                  </PracticeActionWrapper>
                </ActionItem>
                {timeOpen && (
                  <DateTimePicker
                    mode="time"
                    selectedValue={selectedTime}
                    setValue={onSelectedTime}
                    close={toggleTime}
                  />
                )}
              </ActionList>
              <Spacer24 />

              {(reminderUpdated || isLoading) && (
                <ButtonWrapper>
                  <UpdateButton loading={isLoading} onPress={onUpdateReminder}>
                    {t('updateButton')}
                  </UpdateButton>
                </ButtonWrapper>
              )}
            </>
          )}
        </Gutters>
      </BottomSheetScrollView>
    </SheetModal>
  );
};

export default RemindersModal;
