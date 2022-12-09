import React from 'react';
import {Alert} from 'react-native';
import styled from 'styled-components/native';
import ScreenWrapper from '../../../lib/uiLib/decorators/ScreenWrapper';
import {Spacer16, Spacer8} from '../Spacers/Spacer';
import {Heading16} from '../Typography/Heading/Heading';
import ProfilePicture from './ProfilePicture';

const Wrapper = styled.View({
  height: 144,
  flexDirection: 'row',
});

const SmallWrapper = styled(Wrapper)({
  height: 32,
});

export const AllTypes = () => (
  <ScreenWrapper>
    <Heading16>Letter</Heading16>
    <Spacer8 />
    <Wrapper>
      <ProfilePicture letter="A" />
      <Spacer8 />
      <ProfilePicture hasError letter="A" />
    </Wrapper>
    <Spacer8 />
    <SmallWrapper>
      <ProfilePicture letter="A" />
      <Spacer8 />
      <ProfilePicture hasError letter="A" />
    </SmallWrapper>
    <Spacer16 />

    <Heading16>Image</Heading16>
    <Spacer8 />
    <Wrapper>
      <ProfilePicture pictureURL="https://camo.githubusercontent.com/2281c4cf181309c6c41eb8e1388e4f3e9d192b8b1d8d2c7e1df042968c3e79cf/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f63757063616b652d32396b2f696d6167652f75706c6f61642f745f70726f66696c655f706963747572652f76313636353431333734302f436f6e7472696275746f72732f4e616d25323056752e706e673f733d313030" />
      <Spacer8 />
      <ProfilePicture
        hasError
        pictureURL="https://camo.githubusercontent.com/2281c4cf181309c6c41eb8e1388e4f3e9d192b8b1d8d2c7e1df042968c3e79cf/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f63757063616b652d32396b2f696d6167652f75706c6f61642f745f70726f66696c655f706963747572652f76313636353431333734302f436f6e7472696275746f72732f4e616d25323056752e706e673f733d313030"
      />
    </Wrapper>
    <Spacer8 />
    <SmallWrapper>
      <ProfilePicture pictureURL="https://camo.githubusercontent.com/2281c4cf181309c6c41eb8e1388e4f3e9d192b8b1d8d2c7e1df042968c3e79cf/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f63757063616b652d32396b2f696d6167652f75706c6f61642f745f70726f66696c655f706963747572652f76313636353431333734302f436f6e7472696275746f72732f4e616d25323056752e706e673f733d313030" />
      <Spacer8 />
      <ProfilePicture
        hasError
        pictureURL="https://camo.githubusercontent.com/2281c4cf181309c6c41eb8e1388e4f3e9d192b8b1d8d2c7e1df042968c3e79cf/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f63757063616b652d32396b2f696d6167652f75706c6f61642f745f70726f66696c655f706963747572652f76313636353431333734302f436f6e7472696275746f72732f4e616d25323056752e706e673f733d313030"
      />
    </SmallWrapper>
    <Spacer16 />

    <Heading16>With onPress</Heading16>
    <Spacer8 />
    <Wrapper>
      <ProfilePicture onPress={() => Alert.alert('ACTION!')} letter="A" />
      <Spacer8 />
      <ProfilePicture
        onPress={() => Alert.alert('ACTION!')}
        pictureURL="https://camo.githubusercontent.com/2281c4cf181309c6c41eb8e1388e4f3e9d192b8b1d8d2c7e1df042968c3e79cf/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f63757063616b652d32396b2f696d6167652f75706c6f61642f745f70726f66696c655f706963747572652f76313636353431333734302f436f6e7472696275746f72732f4e616d25323056752e706e673f733d313030"
      />
    </Wrapper>
    <Spacer8 />
    <SmallWrapper>
      <ProfilePicture onPress={() => Alert.alert('ACTION!')} letter="A" />
      <Spacer8 />
      <ProfilePicture
        onPress={() => Alert.alert('ACTION!')}
        pictureURL="https://camo.githubusercontent.com/2281c4cf181309c6c41eb8e1388e4f3e9d192b8b1d8d2c7e1df042968c3e79cf/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f63757063616b652d32396b2f696d6167652f75706c6f61642f745f70726f66696c655f706963747572652f76313636353431333734302f436f6e7472696275746f72732f4e616d25323056752e706e673f733d313030"
      />
    </SmallWrapper>
    <Spacer16 />
  </ScreenWrapper>
);
