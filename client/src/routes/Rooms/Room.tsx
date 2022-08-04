import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ListRenderItemInfo} from 'react-native';
import {FlatList, TextInput} from 'react-native-gesture-handler';
import styled from 'styled-components/native';

import {createRoom, getRooms, Room} from '../../lib/api/room';

import {
  Spacer12,
  Spacer16,
  Spacer32,
  Spacer8,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import {B1} from '../../common/components/Typography/Text/Text';
import {COLORS} from '../../common/constants/colors';
import {SPACINGS} from '../../common/constants/spacings';
import Gutters from '../../common/components/Gutters/Gutters';
import {H3} from '../../common/components/Typography/Heading/Heading';
import Button from '../../common/components/Buttons/Button';

const Card = styled.TouchableOpacity({
  border: 0.1,
  borderColor: COLORS.BODY500,
  padding: SPACINGS.SIXTEEN,
  borderRadius: SPACINGS.TWELVE,
  backgroundColor: COLORS.WHITE_TRANSPARENT,
});

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [newRoom, onChangeNewRoom] = useState<string | null>(null);

  const addNewRoom = useCallback(
    roomName => roomName && createRoom(roomName),
    [],
  );

  const renderRoom = ({item}: ListRenderItemInfo<Room>) => (
    <Card>
      <B1>{item.name}</B1>
    </Card>
  );

  useEffect(() => {
    (async () => setRooms(await getRooms()))();
  }, [setRooms]);

  return (
    <>
      <TopSafeArea />
      <Gutters>
        <H3>{'Rooms'}</H3>
        <Spacer16 />
        <FlatList
          data={rooms}
          keyExtractor={room => room.id}
          ItemSeparatorComponent={Spacer12}
          renderItem={renderRoom}
        />
        <Spacer32 />
        <TextInput placeholder="Room name" onChangeText={onChangeNewRoom} />
        <Spacer8 />
        <Button onPress={() => addNewRoom(newRoom)}>
          <B1>{'Create room'}</B1>
        </Button>
      </Gutters>
    </>
  );
};

export default Rooms;
