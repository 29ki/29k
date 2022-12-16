import React from 'react';
import DrawerMenu from './DrawerMenu';

import * as Buttons from '../../../common/components/Buttons/Buttons.library';
import * as Cards from '../../../common/components/Cards/Cards.library';
import * as Icons from '../../../common/components/Icons/Icons.library';
import * as Typography from '../../../common/components/Typography/Typography.library';
import * as UiSettings from '../../../common/constants/UiSettings.library';
import * as Session from '../../../routes/Session/components/Session.library';
import * as Screen from '../../../common/components/Screen/Screen.library';
import * as Modals from '../../../common/components/Modals/Modals.library';
import * as ActionList from '../../../common/components/ActionList/ActionList.library';
import * as ProfilePicture from '../../../common/components/User/ProfilePicture.library';

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
  SessionComponents: [Session],
  ProfilePicture: [ProfilePicture],
  UiSettings: [UiSettings],
};

const UiLibRootComponent = () => <DrawerMenu items={menuItems} />;

export default UiLibRootComponent;
