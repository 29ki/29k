import React from 'react';
import {TopSafeArea} from '../Spacers/Spacer';
import {COLORS} from '../../../../../shared/src/constants/colors';
import TopBar from './TopBar';
import {Display20, Display36} from '../Typography/Display/Display';

export const Default = () => (
  <>
    <TopSafeArea />
    <TopBar />
  </>
);

export const Title = () => (
  <>
    <TopSafeArea />
    <TopBar title="Title" />
  </>
);

export const BackButton = () => (
  <>
    <TopSafeArea />
    <TopBar onPressBack={() => {}} />
  </>
);

export const CloseButton = () => (
  <>
    <TopSafeArea />
    <TopBar onPressClose={() => {}} />
  </>
);

export const EllipsisButton = () => (
  <>
    <TopSafeArea />
    <TopBar onPressEllipsis={() => {}} />
  </>
);

export const BackgroundColor = () => (
  <>
    <TopSafeArea />
    <TopBar backgroundColor="#ff0000" onPressBack={() => {}} />
  </>
);

export const Content = () => (
  <>
    <TopSafeArea />
    <TopBar>
      <Display20>Custom content</Display20>
    </TopBar>
  </>
);

export const Fade = () => (
  <>
    <TopSafeArea />
    <TopBar backgroundColor={COLORS.GREYDARK} onPressBack={() => {}} fade />
    <Display36>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the
      1500s.
    </Display36>
  </>
);

export const Everything = () => (
  <>
    <TopSafeArea />
    <TopBar
      title="Title"
      backgroundColor={COLORS.GREYDARK}
      onPressBack={() => {}}
      onPressClose={() => {}}
      onPressEllipsis={() => {}}
      fade>
      <Display20>Custom content</Display20>
    </TopBar>
    <Display36>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the
      1500s.
    </Display36>
  </>
);
