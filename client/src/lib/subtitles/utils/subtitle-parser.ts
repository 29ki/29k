import vttToJson from 'vtt-to-json';
import srtParser2 from 'srt-parser-2';

import {Subtitle} from '..';
import timeToSeconds from './time-to-seconds';

const subtitleParser = async (subitleUrl: string): Promise<Subtitle[]> => {
  const response = await fetch(subitleUrl);
  const subtitleData = await response.text();

  const subtitleType = subitleUrl.split('.')[subitleUrl.split('.').length - 1];

  const result: Subtitle[] = [];

  if (subtitleType === 'srt') {
    interface srtParserSubtitle {
      startTime: string;
      endTime: string;
      text: string;
    }

    const parser: {
      fromSrt: (data: any) => srtParserSubtitle[];
    } = new srtParser2();

    const parsedSubtitle: srtParserSubtitle[] = parser.fromSrt(subtitleData);

    parsedSubtitle.forEach(({startTime, endTime, text}) => {
      result.push({
        start: timeToSeconds(startTime.split(',')[0]),
        end: timeToSeconds(endTime.split(',')[0]),
        part: text,
      });
    });
  }

  if (subtitleType === 'vtt') {
    interface vttToJsonSubtitle {
      start: number;
      end: number;
      part: string;
    }

    const parsedSubtitle: vttToJsonSubtitle[] = await vttToJson(subtitleData);

    parsedSubtitle.forEach(({start, end, part}) => {
      // For some reason this library adds the index of the subtitle at the end of the part, so we cut it
      result.push({
        start: start / 1000,
        end: end / 1000,
        part: part.slice(
          0,
          part.length - part.split(' ')[part.split(' ').length - 1].length,
        ),
      });
    });
  }

  return result;
};

export default subtitleParser;
