import React from 'react';

import ScreenWrapper from '../../uiLib/decorators/ScreenWrapper';
import {
  Heading24,
  Heading22,
  Heading18,
  Heading16,
  ModalHeading,
} from './Heading/Heading';
import {Body18, Body16, Body14, BodyBold, TextLink} from './Body/Body';
import Input from './TextInput/TextInput';
import MarkdownRenderer from './Markdown/Markdown';
import {Spacer16, Spacer24, Spacer8} from '../Spacers/Spacer';
import {
  Display14,
  Display16,
  Display18,
  Display22,
  Display24,
  Display28,
  Display36,
} from './Display/Display';

const HeadingsList = () => (
  <>
    <Body14>Default: HKGrotesk Bold</Body14>
    <Heading24>Heading 24</Heading24>
    <Heading22>Heading 22</Heading22>
    <Heading18>Heading 18</Heading18>
    <Heading16>Heading 16</Heading16>
    <Spacer16 />
    <Body14>Default: HKGrotesk Medium</Body14>
    <ModalHeading>Modal Heading</ModalHeading>
  </>
);

const DisplaysList = () => (
  <>
    <Body14>Default: PlayfairDisplay Regular</Body14>
    <Display36>Display36</Display36>
    <Display28>Display28</Display28>
    <Display24>Display36</Display24>
    <Display22>Display36</Display22>
    <Display18>Display36</Display18>
    <Display16>Display36</Display16>
    <Display14>Display36</Display14>
  </>
);

const MarkdownList = () => (
  <>
    <Body14>Markdown</Body14>

    <MarkdownRenderer>
      {`
# Heading
## Heading
### Heading
#### Heading

Paragraph text **bold** *italic* ~~highlighted~~ http://29k.org

![An image](https://static.tildacdn.com/tild3631-3833-4238-a237-613330346266/white_circle_black.png)

----

* Unordered list item 1
* Unordered list item 2
* Unordered list with a lot of text that should line break.........
&nbsp;

1. Ordered list item 1
2. Ordered list item 2
3. Ordered list with a lot of text that should line break.........
&nbsp;
>BlockQuote example`}
    </MarkdownRenderer>
  </>
);

const BodiesList = () => (
  <>
    <Body14>Default: HKGrotesk Regular</Body14>
    <Body18>
      Body 18 Regular Lorem Ipsum is simply dummy text of the printing and
      typesetting industry. Lorem Ipsum has been the industry's standard dummy
      text ever since the 1500s.
    </Body18>
    <Spacer16 />
    <Body16>
      Body 16 Regular Lorem Ipsum is simply dummy text of the printing and
      typesetting industry. Lorem Ipsum has been the industry's standard dummy
      text ever since the 1500s.
    </Body16>
    <Spacer16 />
    <Body14>
      Body 14 Regular Lorem Ipsum is simply dummy text of the printing and
      typesetting industry. Lorem Ipsum has been the industry's standard dummy
      text ever since the 1500s.
    </Body14>
    <Spacer16 />

    <Body14>Default: HKGrotesk Bold</Body14>
    <Body18>
      <BodyBold>
        Bold Body 18 Regular Lorem Ipsum is simply dummy text of the printing
        and typesetting industry. Lorem Ipsum has been the industry's standard
        dummy text ever since the 1500s.
      </BodyBold>
    </Body18>
    <Spacer16 />
    <Body16>
      <BodyBold>
        Bold Body 16 Regular Lorem Ipsum is simply dummy text of the printing
        and typesetting industry. Lorem Ipsum has been the industry's standard
        dummy text ever since the 1500s.
      </BodyBold>
    </Body16>
    <Spacer16 />
    <Body14>
      <BodyBold>
        Bold Body 14 Regular Lorem Ipsum is simply dummy text of the printing
        and typesetting industry. Lorem Ipsum has been the industry's standard
        dummy text ever since the 1500s.
      </BodyBold>
    </Body14>
  </>
);

export const Displays = () => (
  <ScreenWrapper>
    <DisplaysList />
  </ScreenWrapper>
);

export const Headings = () => (
  <ScreenWrapper>
    <HeadingsList />
  </ScreenWrapper>
);

export const Bodies = () => (
  <ScreenWrapper>
    <BodiesList />
  </ScreenWrapper>
);

export const Markdown = () => (
  <ScreenWrapper>
    <MarkdownList />
  </ScreenWrapper>
);

export const Layouts = () => (
  <ScreenWrapper>
    <Display22>A Display22</Display22>
    <Body16>
      With a Body16 Lorem Ipsum is simply dummy text of the printing and
      typesetting industry. <TextLink onPress={() => {}}>Text link</TextLink>{' '}
      <BodyBold>Lorem Ipsum</BodyBold> has been the industry's standard dummy
      text ever since the 1500s.
    </Body16>
    <Spacer24 />
    <Heading18>A Heading18</Heading18>
    <Body16>
      With a Body16 Lorem Ipsum is simply dummy text of the printing and
      typesetting industry.
      <BodyBold>Lorem Ipsum</BodyBold> has been the industry's standard dummy
      text ever since the 1500s.
    </Body16>
    <Spacer24 />
    <Heading16>A Heading18</Heading16>
    <Body14>
      With a Body16 Lorem Ipsum is simply dummy text of the printing and
      typesetting industry.
      <BodyBold>Lorem Ipsum</BodyBold> has been the industry's standard dummy
      text ever since the 1500s.
    </Body14>
    <Spacer24 />
    <Display28>A Display22</Display28>
    <Body16>
      <BodyBold>
        With a Body16 Lorem Ipsum is simply dummy text of the printing and
        typesetting industry.
      </BodyBold>{' '}
      Lorem Ipsum has been the industry's standard dummy text ever since the
      1500s.
    </Body16>
  </ScreenWrapper>
);
export const AllTypes = () => (
  <ScreenWrapper>
    <DisplaysList />
    <Spacer16 />
    <HeadingsList />
    <Spacer16 />
    <BodiesList />
    <Spacer16 />
    <MarkdownList />
    <Spacer16 />
    <Display28>
      <TextLink onPress={() => {}}>Text link</TextLink>
    </Display28>
    <Spacer8 />
    <Input placeholder="Placeholder" />
  </ScreenWrapper>
);
