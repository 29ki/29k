import React, {Fragment} from 'react';
import {mapObjIndexed, mergeAll, values} from 'ramda';
import {Text, Button, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {SafeAreaView} from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import {TouchableOpacity} from 'react-native-gesture-handler';
import {useUiLib} from '../hooks/useUiLib';
import {ComponentLibrary, ComponentList} from './UiLibRootComponent';
import {COLORS} from '../../../../../shared/src/constants/colors';

const Drawer = createDrawerNavigator();

const SafeAreaViewWrapper = styled(SafeAreaView)({flex: 1});

const ScrollViewWrapper = styled.ScrollView({flex: 1});

const MenuWrapper = styled(TouchableOpacity)((props: {active: boolean}) => ({
  paddingVertical: 5,
  backgroundColor: props.active ? COLORS.PRIMARY : 'transparent',
}));

const MenuText = styled(Text)((props: {active: boolean}) => ({
  fontSize: 15,
  paddingLeft: 40,
  color: props.active ? 'white' : 'black',
}));

const TopLevelText = styled(Text)({
  fontSize: 17,
  paddingLeft: 20,
  fontWeight: 'bold',
});

const renderScreens = (imports: any, parentName: string) => {
  const screen = (Component: React.ComponentType, name: string) => (
    <Drawer.Screen
      key={`${parentName}-${name}`}
      name={`${parentName}-${name}`}
      component={Component}
    />
  );

  return values(mapObjIndexed(screen, mergeAll(imports)));
};

const DrawerContent: (
  items: ComponentList,
  onClose: () => void,
) => React.FunctionComponent<DrawerContentComponentProps> =
  (items, onClose) =>
  ({navigation}) => {
    const navState = navigation.getState();
    const activeRouteName = navState.routes[navState.index].name;

    /* eslint-disable react/no-unstable-nested-components */
    const renderMenuItem = (parentName: string) => (_: any, name: string) => (
      <MenuWrapper
        key={`Menu-item-${parentName}-${name}`}
        active={activeRouteName === `${parentName}-${name}`}
        onPress={() => {
          navigation.navigate(`${parentName}-${name}`);
        }}>
        <MenuText active={activeRouteName === name}>{name}</MenuText>
      </MenuWrapper>
    );

    const renderTopLevel = (
      subLevel: Array<ComponentLibrary>,
      name: string,
    ) => (
      <Fragment key={`Top-level-${name}`}>
        <TopLevelText>{name}</TopLevelText>
        {values(mapObjIndexed(renderMenuItem(name), mergeAll(subLevel)))}
      </Fragment>
    );

    return (
      <SafeAreaViewWrapper>
        <ScrollViewWrapper showsVerticalScrollIndicator={false}>
          {values(mapObjIndexed(renderTopLevel, items))}
        </ScrollViewWrapper>
        <Button title="Close Library" onPress={onClose} />
      </SafeAreaViewWrapper>
    );
  };

type MenuProps = {
  items: {[key: string]: Array<{[key: string]: React.ComponentType}>};
};

const Menu: React.FunctionComponent<MenuProps> = ({items}) => {
  const {toggle: onClose} = useUiLib();

  return (
    <NavigationContainer independent={true}>
      <View />
      <Drawer.Navigator
        screenOptions={{headerShown: false}}
        drawerContent={DrawerContent(items, onClose)}>
        {values(mapObjIndexed(renderScreens, items))}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default Menu;
