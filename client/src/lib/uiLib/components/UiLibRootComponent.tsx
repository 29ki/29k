import React from 'react';
import DrawerMenu from './DrawerMenu';

import * as Buttons from '../../../common/components/Buttons/Buttons.library';
import * as Typography from '../../../common/components/Typography/Typography.library';

export type ComponentLibrary = {[key: string]: React.ComponentType};
export type ComponentList = {[key: string]: Array<ComponentLibrary>};

const menuItems: ComponentList = {
  Buttons: [Buttons],
  Typography: [Typography],
};

const UiLibRootComponent = () => <DrawerMenu items={menuItems} />;

export default UiLibRootComponent;
