import React from 'react';
import {ScrollView} from 'react-native';

import ScreenWrapper from '../../../lib/uiLib/decorators/ScreenWrapper';
import {H24, H22, H18, H16} from './Heading/Heading';
import {B18, B16, B14, TextLink} from './Text/Text';
import Input from './TextInput/TextInput';
import MarkdownRenderer from './Markdown/Markdown';
import {Spacer16, Spacer8} from '../Spacers/Spacer';
import {
  Display14,
  Display16,
  Display18,
  Display22,
  Display24,
  Display28,
  Display36,
} from './Display/Display';
import Gutters from '../Gutters/Gutters';

export const AllTypes = () => (
  <ScrollView>
    <Displays />
    <Headings />
    <Bodies />
    <Gutters>
      <TextLink onPress={() => {}}>Text link</TextLink>
      <Spacer8 />
      <Input placeholder="Placeholder" />
    </Gutters>
  </ScrollView>
);

export const Displays = () => (
  <ScreenWrapper>
    <B14>Default: PlayfairDisplay Regular</B14>
    <Display36>Display36</Display36>
    <Display28>Display28</Display28>
    <Display24>Display36</Display24>
    <Display22>Display36</Display22>
    <Display18>Display36</Display18>
    <Display16>Display36</Display16>
    <Display14>Display36</Display14>
  </ScreenWrapper>
);
export const Headings = () => (
  <ScreenWrapper>
    <Spacer16 />
    <B14>Default: HKGrotesk Bold</B14>
    <H24>Heading 24</H24>
    <H22>Heading 22</H22>
    <H18>Heading 18</H18>
    <H16>Heading 16</H16>
  </ScreenWrapper>
);
export const Bodies = () => (
  <ScreenWrapper>
    <Spacer16 />
    <B14>Default: HKGrotesk Regular</B14>
    <B18>Body 1</B18>
    <B16>Body 2</B16>
    <B14>Body 3</B14>
    <Spacer16 />
  </ScreenWrapper>
);

export const Markdown = () => (
  <ScreenWrapper>
    <Spacer16 />
    <MarkdownRenderer>
      {`
# Heading1
## Heading2
### Heading3
#### Heading4

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
  </ScreenWrapper>
);
