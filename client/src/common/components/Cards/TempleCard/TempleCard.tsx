import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';
import styled from 'styled-components/native';

import {Temple} from '../../../../../../shared/src/types/Temple';
import useExerciseById from '../../../../lib/content/hooks/useExerciseById';
import NS from '../../../../lib/i18n/constants/namespaces';
import useTempleNotificationReminder from '../../../../routes/Temples/hooks/useTempleNotificationReminder';
import {RootStackProps} from '../../../constants/routes';
import {PlusIcon, BellIcon} from '../../Icons';
import Card from '../Card';
import useAddToCalendar from '../../../../routes/Temples/hooks/useAddToCalendar';
import {Body14, BodyBold} from '../../Typography/Body/Body';
import Counter from '../../../../routes/Temple/components/Counter/Counter';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../constants/spacings';
import {Spacer4} from '../../Spacers/Spacer';

const Badge = styled.View({
  backgroundColor: COLORS.PURE_WHITE,
  paddingVertical: SPACINGS.FOUR,
  paddingHorizontal: SPACINGS.EIGHT,
  borderRadius: SPACINGS.EIGHT,
});

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

type TempleCardProps = {
  temple: Temple;
};

const TempleCard: React.FC<TempleCardProps> = ({temple}) => {
  const {contentId, startTime, started} = temple;
  const exercise = useExerciseById(contentId);
  const addToCalendar = useAddToCalendar();
  const {t} = useTranslation(NS.COMPONENT.TEMPLE_CARD);
  const {navigate} = useNavigation<NativeStackNavigationProp<RootStackProps>>();
  const {reminderEnabled} = useTempleNotificationReminder(temple);

  const startAt = dayjs(startTime);
  const startingNow = dayjs().isAfter(startAt.subtract(10, 'minutes'));

  const onPress = () =>
    startingNow
      ? navigate('TempleStack', {
          screen: 'ChangingRoom',
          params: {
            templeId: temple.id,
          },
        })
      : addToCalendar(exercise?.name, startAt, startAt.add(30, 'minutes'));

  const onContextPress = () => navigate('TempleModal', {temple});

  return (
    <Card
      title={exercise?.name}
      buttonText={startingNow ? t('join') : t('addToCalendar')}
      ButtonIcon={PlusIcon}
      image={{
        uri: exercise?.card?.image?.source,
      }}
      onPress={onPress}
      onContextPress={onContextPress}
      Icon={reminderEnabled ? BellIcon : undefined}>
      <Row>
        <Body14>{t('starts')}</Body14>
        <Spacer4 />
        <Badge>
          <Body14>
            <BodyBold>
              <Counter startTime={startAt} starting={started} />
            </BodyBold>
          </Body14>
        </Badge>
      </Row>
    </Card>
  );
};

export default TempleCard;
