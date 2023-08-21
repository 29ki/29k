import React from 'react';
import DrawerMenu from './DrawerMenu';

import * as Buttons from '../../components/Buttons/Buttons.library';
import * as Cards from '../../components/Cards/Cards.library';
import * as Icons from '../../components/Icons/Icons.library';
import * as Typography from '../../components/Typography/Typography.library';
import * as UiSettings from '../../constants/UiSettings.library';
import * as Session from '../../session/components/Session.library';
import * as Interested from '../../components/Interested/Interested.library';
import * as Screen from '../../components/Screen/Screen.library';
import * as HeaderScrollView from '../../components/HeaderScrollView/HeaderScrollView.library';
import * as Modals from '../../components/Modals/Modals.library';
import * as ActionList from '../../components/ActionList/ActionList.library';
import * as ProfilePicture from '../../components/User/ProfilePicture.library';
import * as TopBar from '../../components/TopBar/TopBar.library';
import * as ErrorBanner from '../../components/ErrorBanner/ErrorBanner.library';

export type ComponentLibrary = {[key: string]: React.ComponentType};
export type ComponentList = {[key: string]: Array<ComponentLibrary>};

const menuItems: ComponentList = {
  Buttons: [Buttons],
  Cards: [Cards],
  Icons: [Icons],
  ActionList: [ActionList],
  Modals: [Modals],
  Typography: [Typography],
  Screen: [Screen],
  TopBar: [TopBar],
  ErrorBanner: [ErrorBanner],
  HeaderScrollView: [HeaderScrollView],
  Interested: [Interested],
  SessionComponents: [Session],
  ProfilePicture: [ProfilePicture],
  UiSettings: [UiSettings],
};

const UiLibRootComponent = () => <DrawerMenu items={menuItems} />;

export default UiLibRootComponent;
