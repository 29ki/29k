import React from 'react';
import {Alert} from 'react-native';
import styled from 'styled-components/native';
import ScreenWrapper from '../../uiLib/decorators/ScreenWrapper';
import {Spacer16, Spacer8} from '../Spacers/Spacer';
import {Heading16} from '../Typography/Heading/Heading';
import ProfilePicture from './ProfilePicture';

const Wrapper = styled.View({
  flexDirection: 'row',
});

export const AllTypes = () => (
  <ScreenWrapper>
    <Heading16>No letter</Heading16>
    <Spacer8 />
    <Wrapper>
      <ProfilePicture />
      <Spacer8 />
      <ProfilePicture hasError />
    </Wrapper>
    <Spacer8 />
    <Wrapper>
      <ProfilePicture size={30} />
      <Spacer8 />
      <ProfilePicture size={30} hasError />
    </Wrapper>
    <Spacer16 />

    <Heading16>Letter</Heading16>
    <Spacer8 />
    <Wrapper>
      <ProfilePicture letter="A" />
      <Spacer8 />
      <ProfilePicture hasError letter="A" />
    </Wrapper>
    <Spacer8 />
    <Wrapper>
      <ProfilePicture size={30} letter="A" />
      <Spacer8 />
      <ProfilePicture size={30} hasError letter="A" />
    </Wrapper>
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
    <Wrapper>
      <ProfilePicture
        size={30}
        pictureURL="https://camo.githubusercontent.com/2281c4cf181309c6c41eb8e1388e4f3e9d192b8b1d8d2c7e1df042968c3e79cf/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f63757063616b652d32396b2f696d6167652f75706c6f61642f745f70726f66696c655f706963747572652f76313636353431333734302f436f6e7472696275746f72732f4e616d25323056752e706e673f733d313030"
      />
      <Spacer8 />
      <ProfilePicture
        size={30}
        hasError
        pictureURL="https://camo.githubusercontent.com/2281c4cf181309c6c41eb8e1388e4f3e9d192b8b1d8d2c7e1df042968c3e79cf/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f63757063616b652d32396b2f696d6167652f75706c6f61642f745f70726f66696c655f706963747572652f76313636353431333734302f436f6e7472696275746f72732f4e616d25323056752e706e673f733d313030"
      />
    </Wrapper>
    <Spacer16 />

    <Heading16>With backgroundColor</Heading16>
    <Spacer8 />
    <Wrapper>
      <ProfilePicture backgroundColor="darksalmon" />
      <Spacer8 />
      <ProfilePicture backgroundColor="darksalmon" letter="A" hasError />
    </Wrapper>
    <Spacer8 />
    <Wrapper>
      <ProfilePicture size={30} backgroundColor="darksalmon" />
      <Spacer8 />
      <ProfilePicture
        size={30}
        backgroundColor="darksalmon"
        letter="A"
        hasError
      />
    </Wrapper>
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
    <Wrapper>
      <ProfilePicture
        size={30}
        onPress={() => Alert.alert('ACTION!')}
        letter="A"
      />
      <Spacer8 />
      <ProfilePicture
        size={30}
        onPress={() => Alert.alert('ACTION!')}
        pictureURL="https://camo.githubusercontent.com/2281c4cf181309c6c41eb8e1388e4f3e9d192b8b1d8d2c7e1df042968c3e79cf/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f63757063616b652d32396b2f696d6167652f75706c6f61642f745f70726f66696c655f706963747572652f76313636353431333734302f436f6e7472696275746f72732f4e616d25323056752e706e673f733d313030"
      />
    </Wrapper>
    <Spacer16 />

    <Heading16>Loading</Heading16>
    <Spacer8 />
    <Wrapper>
      <ProfilePicture loading letter="A" />
      <Spacer8 />
      <ProfilePicture
        loading
        pictureURL="https://camo.githubusercontent.com/2281c4cf181309c6c41eb8e1388e4f3e9d192b8b1d8d2c7e1df042968c3e79cf/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f63757063616b652d32396b2f696d6167652f75706c6f61642f745f70726f66696c655f706963747572652f76313636353431333734302f436f6e7472696275746f72732f4e616d25323056752e706e673f733d313030"
      />
    </Wrapper>
    <Spacer8 />
    <Wrapper>
      <ProfilePicture size={30} loading letter="A" />
      <Spacer8 />
      <ProfilePicture
        size={30}
        loading
        pictureURL="https://camo.githubusercontent.com/2281c4cf181309c6c41eb8e1388e4f3e9d192b8b1d8d2c7e1df042968c3e79cf/68747470733a2f2f7265732e636c6f7564696e6172792e636f6d2f63757063616b652d32396b2f696d6167652f75706c6f61642f745f70726f66696c655f706963747572652f76313636353431333734302f436f6e7472696275746f72732f4e616d25323056752e706e673f733d313030"
      />
    </Wrapper>
    <Spacer16 />
  </ScreenWrapper>
);
