import React from 'react';
import DrawerMenu from './DrawerMenu';

import * as Buttons from '../../../common/components/Buttons/Buttons.library';
import * as Cards from '../../../common/components/Cards/Cards.library';
import * as Icons from '../../../common/components/Icons/Icons.library';
import * as Typography from '../../../common/components/Typography/Typography.library';
import * as UiSettings from '../../../common/constants/UiSettings.library';
import * as Session from '../../../routes/Session/components/Session.library';
import * as Screen from '../../../common/components/Screen/Screen.library';
import * as Modal from '../../../common/components/Modal/Modal.library';

export type ComponentLibrary = {[key: string]: React.ComponentType};
export type ComponentList = {[key: string]: Array<ComponentLibrary>};

const menuItems: ComponentList = {
  Buttons: [Buttons],
  Cards: [Cards],
  Icons: [Icons],
  Modal: [Modal],
  Typography: [Typography],
  Screen: [Screen],
  SessionComponents: [Session],
  UiSettings: [UiSettings],
};

const UiLibRootComponent = () => <DrawerMenu items={menuItems} />;

export default UiLibRootComponent;
