import React, {Fragment, useEffect} from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components/native';
import {Card} from '../../../client/src/lib/components/Cards/Card';
import {CardSmall} from '../../../client/src/lib/components/Cards/CardSmall';
import {PreviewTemplateComponentProps} from 'decap-cms-core';
import {MobileWidth, MobileView} from './components/MobileView';
import {
  Spacer16,
  Spacer24,
  Spacer4,
} from '../../../client/src/lib/components/Spacers/Spacer';
import useSessionState from '../../../client/src/lib/session/state/state';
import {
  AsyncSessionType,
  SessionMode,
  SessionType,
} from '../../../shared/src/schemas/Session';
import {
  DEFAULT_LANGUAGE_TAG,
  LANGUAGE_TAG,
} from '../../../shared/src/i18n/constants';
import PortalVideo from './components/PortalVideo';
import PortalP5 from './components/PortalP5';
import {Heading16} from '../../../client/src/lib/components/Typography/Heading/Heading';
import {INTRO_PORTAL, OUTRO_PORTAL} from '../fields/exercise';
import Slide from './components/Slide';
import {ExerciseWithLanguage} from '../../../client/src/lib/content/types';

const Slides = styled.View({
  minWidth: '100%',
  flexDirection: 'row',
});

const ExercisePreview = (props: PreviewTemplateComponentProps) => {
  const setAsyncSession = useSessionState(state => state.setAsyncSession);
  const setExercise = useSessionState(state => state.setExercise);

  const entry = props.entry.get('data').toJS() as ExerciseWithLanguage;
  const tagsFields = props.fieldsMetaData.getIn(['tags', 'tags'])?.toJS();
  const tags =
    entry.tags?.map((tagId: string) => tagsFields && tagsFields[tagId]?.name) ??
    [];
  const language =
    'locale' in props ? (props.locale as LANGUAGE_TAG) : DEFAULT_LANGUAGE_TAG;

  useEffect(() => {
    const session: AsyncSessionType = {
      type: SessionType.public,
      mode: SessionMode.async,
      id: 'wip',
      startTime: dayjs().toISOString(),
      exerciseId: entry.id,
      language,
    };
    setAsyncSession(session);
    setExercise(entry);
  }, [entry, language, setAsyncSession, setExercise]);

  if (props.isLoadingAsset) return null;

  return (
    <>
      <MobileWidth>
        <Spacer24 />
        <Card
          title={entry.name}
          tags={[`${entry.duration ?? 0} min`, ...tags]}
          description={entry.description}
          cardStyle={entry.card}
          onPress={() => null}
        />
        <Spacer16 />
        <CardSmall
          title={entry.name}
          cardStyle={entry.card}
          onPress={() => null}
        />
      </MobileWidth>
      <Spacer16 />
      <Slides>
        <MobileView>
          <Heading16>{INTRO_PORTAL.label} - Loop</Heading16>
          <Spacer4 />
          {entry.introPortal?.videoLoop?.p5JsScript?.code ? (
            <MobileView>
              <PortalP5 script={entry.introPortal.videoLoop.p5JsScript.code} />
            </MobileView>
          ) : (
            <>
              <MobileView>
                <PortalVideo
                  source={entry.introPortal?.videoLoop?.source}
                  loop
                />
              </MobileView>
              <Spacer16 />
              <MobileView>
                <Heading16>{INTRO_PORTAL.label} - Transition</Heading16>
                <Spacer4 />
                <MobileView>
                  <PortalVideo source={entry.introPortal?.videoEnd?.source} />
                </MobileView>
              </MobileView>
              <Spacer16 />
            </>
          )}
        </MobileView>
        <Spacer16 />
        {entry.slides.map((slide, index) => (
          <Fragment key={index}>
            <Slide slide={slide} />
            <Spacer16 />
          </Fragment>
        ))}
        {entry.outroPortal?.video?.source ? (
          <MobileView>
            <Heading16>{OUTRO_PORTAL.label}</Heading16>
            <Spacer4 />
            <MobileView>
              <PortalVideo source={entry.outroPortal?.video?.source} />
            </MobileView>
          </MobileView>
        ) : entry.introPortal?.videoLoop?.p5JsScript?.code ? (
          <MobileView>
            <Heading16>{INTRO_PORTAL.label} - Loop</Heading16>
            <Spacer4 />
            <MobileView>
              <PortalP5 script={entry.introPortal.videoLoop.p5JsScript.code} />
            </MobileView>
          </MobileView>
        ) : (
          <MobileView>
            <Heading16>{INTRO_PORTAL.label} - Transition Reversed</Heading16>
            <Spacer4 />
            <MobileView>
              <PortalVideo
                source={entry.introPortal?.videoEnd?.source}
                reverse
              />
            </MobileView>
            <Spacer16 />
            <Heading16>{INTRO_PORTAL.label} - Loop Reversed</Heading16>
            <Spacer4 />
            <MobileView>
              <PortalVideo
                source={entry.introPortal?.videoLoop?.source}
                loop
                reverse
              />
            </MobileView>
          </MobileView>
        )}
        <Spacer16 />
      </Slides>
      <Spacer16 />
    </>
  );
};

export default ExercisePreview;
