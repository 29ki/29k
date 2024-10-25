import styled from 'styled-components';
import {
  CLIENT_LANGUAGE_TAGS,
  LANGUAGE_TAG,
  LANGUAGES,
} from '../../../../../../shared/src/i18n/constants';
import {ChangeEvent, useCallback} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {
  LanguagesIcon,
  ChevronDownIcon,
} from '../../../../../../client/src/lib/components/Icons';
import {COLORS} from '../../../../../../shared/src/constants/colors';

const Wrapper = styled.div({
  position: 'relative',
});

const LeftIcon = styled.div({
  position: 'absolute',
  left: 0,
  top: 0,
  width: 21,
  height: 21,
  pointerEvents: 'none',
});

const RightIcon = styled.div({
  position: 'absolute',
  right: 0,
  top: 0,
  width: 21,
  height: 21,
  pointerEvents: 'none',
});

const Select = styled.select({
  appearance: 'none',
  paddingLeft: 24,
  paddingRight: 24,
  border: 0,
  background: 'transparent',
  color: COLORS.BLACK,
  fontFamily: 'HKGrotesk-Medium',
  fontSize: 16,
});

const LanguageSelect = () => {
  const router = useRouter();
  const params = useParams<{language: LANGUAGE_TAG}>();

  const onLanguageChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      router.push(`/${e.target.value}/exercises`);
    },
    [router],
  );
  return (
    <Wrapper>
      <LeftIcon>
        <LanguagesIcon />
      </LeftIcon>
      <Select onChange={onLanguageChange} value={params.language}>
        {CLIENT_LANGUAGE_TAGS.map(languageTag => (
          <option key={languageTag} value={languageTag}>
            {LANGUAGES[languageTag]}
          </option>
        ))}
      </Select>
      <RightIcon>
        <ChevronDownIcon />
      </RightIcon>
    </Wrapper>
  );
};

export default LanguageSelect;
