import React, {Fragment, useState} from 'react';
import styled from 'styled-components/native';

import ScreenWrapper from '../../uiLib/decorators/ScreenWrapper';
import {Spacer16, Spacer8} from '../Spacers/Spacer';

import Button from './Button';
import IconButton from './IconButton/IconButton';
import {HomeIcon} from '../Icons/Home/Home';
import {Body16, Body18, BodyBold} from '../Typography/Body/Body';
import {PlusIcon} from '../Icons';
import {AnimatedPlusToCheck} from '../Icons';
import {AnimatedBell} from '../Icons';
import ToggleButton from '../../session/components/HostNotes/ToggleButton';
import TextButton from './TextButton/TextButton';
import RadioButton from './RadioButton/RadioButton';
import CloseButton from './CloseButton/CloseButton';
import AnimatedButton from './AnimatedButton';
import AnimatedIconButton from './IconButton/AnimatedIconButton';
import {COLORS} from '../../../../../shared/src/constants/colors';

const RowFullWidth = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const Row = styled.View({flexDirection: 'row'});

const ButtonWrapper = styled.View({alignItems: 'flex-start'});

const ButtonList = () => {
  const [pressed, setPressed] = useState(false);

  return (
    <>
      <Body18>
        <BodyBold>Buttons</BodyBold>
      </Body18>
      <Spacer8 />
      <RowFullWidth>
        <Button onPress={() => {}}>Primary</Button>
        <Spacer16 />
        <Button loading elevated onPress={() => {}}>
          Elevated Loading
        </Button>
      </RowFullWidth>
      <Spacer16 />
      <RowFullWidth>
        <Button onPress={() => {}} variant="secondary">
          Secondary
        </Button>
        <Spacer16 />
        <Button variant="secondary" elevated onPress={() => {}}>
          Elevated Secondary
        </Button>
      </RowFullWidth>
      <Spacer16 />
      <RowFullWidth>
        <Button onPress={() => {}} variant="tertiary">
          Tertiary
        </Button>
        <Spacer16 />
        <Button variant="tertiary" elevated onPress={() => {}}>
          Elevated Tertiary
        </Button>
      </RowFullWidth>
      <Spacer16 />
      <RowFullWidth>
        <Button onPress={() => {}} variant="secondary">
          Secondary
        </Button>
        <Spacer16 />
        <Button variant="secondary" elevated onPress={() => {}}>
          Elevated Secondary
        </Button>
      </RowFullWidth>
      <Spacer16 />
      <RowFullWidth>
        <Button onPress={() => {}} variant="tertiary">
          Tertiary
        </Button>
        <Spacer16 />
        <Button variant="tertiary" elevated onPress={() => {}}>
          Elevated Tertiary
        </Button>
      </RowFullWidth>
      <Spacer16 />
      <RowFullWidth>
        <Button onPress={() => {}} LeftIcon={HomeIcon}>
          Left icon
        </Button>
        <Spacer16 />
        <Button onPress={() => {}} RightIcon={HomeIcon}>
          Right icon
        </Button>
      </RowFullWidth>
      <Spacer16 />
      <RowFullWidth>
        <Button small onPress={() => {}}>
          Small Button
        </Button>
        <Spacer16 />
        <Button small onPress={() => {}} LeftIcon={HomeIcon}>
          Small with icon
        </Button>
      </RowFullWidth>
      <Spacer16 />
      <RowFullWidth>
        <Button onPress={() => {}} disabled>
          Disabled
        </Button>
        <Spacer16 />
        <Button onPress={() => {}} active>
          Active
        </Button>
      </RowFullWidth>
      <Spacer16 />
      <RowFullWidth>
        <AnimatedButton
          AnimatedIcon={AnimatedPlusToCheck}
          fill={COLORS.WHITE}
          variant={pressed ? 'primary' : 'secondary'}
          active={pressed}
          onPress={() => setPressed(state => !state)}>
          Animated
        </AnimatedButton>
        <Spacer16 />
        <AnimatedButton
          AnimatedIcon={AnimatedPlusToCheck}
          fill={COLORS.WHITE}
          variant={pressed ? 'primary' : 'secondary'}
          active={pressed}
          small
          onPress={() => setPressed(state => !state)}>
          Animated small
        </AnimatedButton>
      </RowFullWidth>
      <Spacer16 />
    </>
  );
};

const IconButtonList = () => {
  const [pressed, setPressed] = useState(false);

  return (
    <>
      <Body18>
        <BodyBold>Icon buttons</BodyBold>
      </Body18>
      <RowFullWidth>
        <Body16>Primary</Body16>
        <Row>
          <IconButton onPress={() => {}} Icon={PlusIcon} />
          <Spacer16 />
          <IconButton elevated onPress={() => {}} Icon={PlusIcon} />
        </Row>
      </RowFullWidth>
      <Spacer16 />
      <RowFullWidth>
        <Body16>Secondary</Body16>
        <Row>
          <IconButton variant="secondary" onPress={() => {}} Icon={PlusIcon} />
          <Spacer16 />
          <IconButton
            variant="secondary"
            elevated
            onPress={() => {}}
            Icon={PlusIcon}
          />
        </Row>
      </RowFullWidth>
      <Spacer16 />
      <RowFullWidth>
        <Body16>Tertiary</Body16>
        <Row>
          <IconButton variant="tertiary" onPress={() => {}} Icon={PlusIcon} />
          <Spacer16 />
          <IconButton
            variant="tertiary"
            elevated
            onPress={() => {}}
            Icon={PlusIcon}
          />
        </Row>
      </RowFullWidth>
      <Spacer16 />
      <RowFullWidth>
        <Body16>Active and disabled</Body16>
        <Row>
          <IconButton onPress={() => {}} Icon={PlusIcon} active />
          <Spacer16 />
          <IconButton
            elevated
            variant="tertiary"
            disabled
            onPress={() => {}}
            Icon={PlusIcon}
          />
        </Row>
      </RowFullWidth>
      <Spacer16 />
      <RowFullWidth>
        <Body16>Small</Body16>
        <IconButton small onPress={() => {}} Icon={PlusIcon} />
      </RowFullWidth>
      <Spacer16 />
      <RowFullWidth>
        <Body16>Animated</Body16>
        <AnimatedIconButton
          AnimatedIcon={AnimatedBell}
          variant={pressed ? 'primary' : 'secondary'}
          fill={COLORS.WHITE}
          active={pressed}
          onPress={() => setPressed(state => !state)}
        />
      </RowFullWidth>
      <Spacer16 />
    </>
  );
};

export const AllButtons = () => (
  <ScreenWrapper>
    <ButtonList />
    <IconButtonList />
    <Spacer16 />
    <Body18>
      <BodyBold>Text button</BodyBold>
    </Body18>
    <Spacer8 />
    <TextButton title="Text button" onPress={() => {}} />
    <Spacer16 />
    <Body18>
      <BodyBold>Close button</BodyBold>
    </Body18>
    <Spacer8 />
    <ButtonWrapper>
      <CloseButton onPress={() => {}} />
    </ButtonWrapper>
    <Spacer16 />
    <Body18>
      <BodyBold>Toggle button</BodyBold>
    </Body18>
    <Spacer8 />
    <ButtonWrapper>
      <ToggleButton onPress={() => {}} title="Is not toggled" />
      <Spacer8 />
      <ToggleButton isToggled onPress={() => {}} title="Is toggled" />
      <Spacer8 />
      <ToggleButton disabled onPress={() => {}} title="Is disabled" />
    </ButtonWrapper>
    <Spacer16 />
    <Body18>
      <BodyBold>Radio button</BodyBold>
    </Body18>
    <Spacer8 />
    <ButtonWrapper>
      <RadioButton onPress={() => {}} active />
      <Spacer8 />
      <RadioButton onPress={() => {}} active={false} />
    </ButtonWrapper>
  </ScreenWrapper>
);

export const Buttons = () => (
  <ScreenWrapper>
    <ButtonList />
  </ScreenWrapper>
);

export const IconButtons = () => (
  <ScreenWrapper>
    <IconButtonList />
  </ScreenWrapper>
);

function getCombinations(variations: object[]) {
  var result: object[] = [];
  var f = function (current: object[], arr: object[]) {
    for (var i = 0; i < arr.length; i++) {
      result.push(
        [...current, arr[i]].reduce(
          (acc, variant) => ({...acc, ...variant}),
          {},
        ),
      );
      f([...current, arr[i]], arr.slice(i + 1));
    }
  };
  f([], variations);
  return result;
}

const buttonVariations = getCombinations([
  {loading: true},
  {elevated: true},
  {active: true},
  {disabled: true},
  {small: true},
  {RightIcon: HomeIcon},
  {LeftIcon: PlusIcon},
]);

export const VariationsButton = () => (
  <ScreenWrapper>
    {buttonVariations.map((combination, i) => (
      <Fragment key={`primary${i}`}>
        <Body16>Primary {Object.keys(combination).join(' ')}</Body16>
        <Spacer8 />
        <ButtonWrapper>
          <Button variant="primary" onPress={() => {}} {...combination}>
            Button
          </Button>
        </ButtonWrapper>
        <Spacer16 />
      </Fragment>
    ))}
    {buttonVariations.map((combination, i) => (
      <Fragment key={`secondary${i}`}>
        <Body16>Secondary {Object.keys(combination).join(' ')}</Body16>
        <Spacer8 />
        <ButtonWrapper>
          <Button variant="secondary" onPress={() => {}} {...combination}>
            Button
          </Button>
        </ButtonWrapper>
        <Spacer16 />
      </Fragment>
    ))}
    {buttonVariations.map((combination, i) => (
      <Fragment key={`tertiary${i}`}>
        <Body16>Tertiary {Object.keys(combination).join(' ')}</Body16>
        <Spacer8 />
        <ButtonWrapper>
          <Button variant="tertiary" onPress={() => {}} {...combination}>
            Button
          </Button>
        </ButtonWrapper>
        <Spacer16 />
      </Fragment>
    ))}
  </ScreenWrapper>
);

const iconButtonVariations = getCombinations([
  {loading: true},
  {elevated: true},
  {active: true},
  {disabled: true},
  {small: true},
]);

export const VariationsIconButton = () => (
  <ScreenWrapper>
    {iconButtonVariations.map((combination, i) => (
      <Fragment key={`primary${i}`}>
        <Body16>Primary {Object.keys(combination).join(' ')}</Body16>
        <Spacer8 />
        <IconButton
          variant="primary"
          onPress={() => {}}
          Icon={PlusIcon}
          {...combination}
        />
        <Spacer16 />
      </Fragment>
    ))}
    {iconButtonVariations.map((combination, i) => (
      <Fragment key={`secondary${i}`}>
        <Body16>Secondary {Object.keys(combination).join(' ')}</Body16>
        <Spacer8 />
        <IconButton
          variant="secondary"
          onPress={() => {}}
          Icon={PlusIcon}
          {...combination}
        />
        <Spacer16 />
      </Fragment>
    ))}
    {iconButtonVariations.map((combination, i) => (
      <Fragment key={`tertiary${i}`}>
        <Body16>Tertiary {Object.keys(combination).join(' ')}</Body16>
        <Spacer8 />
        <IconButton
          variant="tertiary"
          onPress={() => {}}
          Icon={PlusIcon}
          {...combination}
        />
        <Spacer16 />
      </Fragment>
    ))}
  </ScreenWrapper>
);
