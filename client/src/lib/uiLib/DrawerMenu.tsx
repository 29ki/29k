import React, {Fragment} from 'react';
import {mapObjIndexed, mergeAll, values} from 'ramda';
import {Text, ScrollView, Button, View, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';

import {TouchableOpacity} from 'react-native-gesture-handler';
import {useUiLib} from './hooks/useUiLib';
import {ComponentLibrary, ComponentList} from './UiLibRootComponent';
import {SafeAreaView} from 'react-native-safe-area-context';

const Drawer = createDrawerNavigator();

const styles = StyleSheet.create({
  wrapper: {flex: 1},
  scrollWrapper: {flex: 1},
  topLevelItem: {
    fontSize: 17,
    paddingLeft: 20,
    fontWeight: 'bold',
  },
  menuItem: {
    paddingVertical: 5,
    backgroundColor: 'transparent',
  },
  menuItemActive: {
    backgroundColor: 'steelblue',
  },
  menuItemText: {
    fontSize: 15,
    paddingLeft: 40,
    color: 'black',
  },
  menuItemTextActive: {
    color: 'white',
  },
});

const renderScreens = (imports: any) => {
  const screen = (Component: React.ComponentType, name: string) => (
    <Drawer.Screen key={`Screen-${name}`} name={name} component={Component} />
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
    const renderMenuItem = (_: any, title: string) => (
      <TouchableOpacity
        key={`Menu-item-${title}`}
        style={[
          styles.menuItem,
          activeRouteName === title && styles.menuItemActive,
        ]}
        onPress={() => {
          navigation.navigate(title);
        }}>
        <Text
          style={[
            styles.menuItemText,
            activeRouteName === title && styles.menuItemTextActive,
          ]}>
          {title}
        </Text>
      </TouchableOpacity>
    );

    const renderTopLevel = (
      subLevel: Array<ComponentLibrary>,
      title: string,
    ) => (
      <Fragment key={`Top-level-${title}`}>
        <Text style={styles.topLevelItem}>{title}</Text>
        {values(mapObjIndexed(renderMenuItem, mergeAll(subLevel)))}
      </Fragment>
    );

    return (
      <SafeAreaView style={styles.wrapper}>
        <ScrollView
          style={styles.scrollWrapper}
          showsVerticalScrollIndicator={false}>
          {values(mapObjIndexed(renderTopLevel, items))}
        </ScrollView>
        <Button title="Close Library" onPress={onClose} />
      </SafeAreaView>
    );
  };

type MenuProps = {
  items: {[key: string]: Array<{[key: string]: React.ComponentType}>};
};

const Menu: React.FunctionComponent<MenuProps> = ({items}) => {
  const {toggle: onClose} = useUiLib();

  return (
    <NavigationContainer
      independent={true}
      onUnhandledAction={navAction =>
        console.log('navigation action', navAction)
      }>
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
