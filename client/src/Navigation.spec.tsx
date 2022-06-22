import React from 'react';
import Navigation from './Navigation';
import renderer from 'react-test-renderer';

import './i18n';

jest.useFakeTimers();

it('renders navigation correctly', () => {
  renderer.create(<Navigation />);
});
