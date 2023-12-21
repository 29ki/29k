import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, ViewStyle, TextStyle} from 'react-native';

import subtitleParser from './utils/subtitle-parser';

/**
 * * subtitles interface
 * * @param { selectedsubtitle: { file } } url of the subtitle
 * * @param { currentTime } time in miliseconds from the video playback
 * * @param { containerStyle: {} } style for the container of the subtitles component
 * * @param { textStyle: {} } style for the text of the subtitle component
 */
export interface SubtitlesProps {
  selectedsubtitle: {
    file: string;
  };
  currentTime: number;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * * subtitle interface
 * * @param {start} starting time in relation to the video in miliseconds
 * * @param {end} ending time in relation to the video in miliseconds
 * * @param {part} text of the subtitle
 */
export interface Subtitle {
  start: number;
  end: number;
  part: string;
}

const Subtitles: React.FC<SubtitlesProps> = ({
  selectedsubtitle,
  currentTime,
  containerStyle = {},
  textStyle = {},
}): JSX.Element => {
  /**
   * * First phase parses the subtitle url to an array of objects with the subtitle interface schema
   * * method for parsing varies depending on the file extension (vtt or srt)
   */
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);

  const parseSubtitles = useCallback(async () => {
    const parsedSubtitles = await subtitleParser(selectedsubtitle.file);
    setSubtitles(parsedSubtitles);
  }, [selectedsubtitle.file]);

  useEffect(() => {
    parseSubtitles();
  }, [parseSubtitles]);

  /**
   * * Second phase filters the subtitles array to get the subtitles that are currently visible
   */
  const [text, setText] = useState('');

  useEffect(() => {
    if (subtitles) {
      let start = 0;
      let end: number = subtitles.length - 1;

      while (start <= end) {
        const mid: number = Math.floor((start + end) / 2);

        const subtitle: Subtitle = subtitles[mid] || {
          start: 0,
          end: 0,
          part: '',
        };

        if (currentTime >= subtitle.start && currentTime <= subtitle.end) {
          setText(subtitle.part.trim());
          return;
        } else if (currentTime < subtitle.start) {
          end = mid - 1;
        } else {
          start = mid + 1;
        }
      }

      return setText('');
    }
  }, [currentTime, subtitles]);

  return (
    <View style={containerStyle}>
      {text ? <Text style={textStyle}>{text}</Text> : null}
    </View>
  );
};

export default Subtitles;
