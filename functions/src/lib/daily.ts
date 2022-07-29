import fetch from 'node-fetch';

import config from '../config';

const DAILY_API = `${config.DAILY_API_URL}/${config.DAILY_API_VERSION}`;

// https://docs.daily.co/reference/rest-api/rooms
type Room = {
  id: string;
  name: string;
  api_created: boolean;
  privacy: 'public' | 'private';
  url: string;
  created_at: string;
  config: {
    max_participants: number;
    nbf: number;
    exp: number;
    start_video_off: boolean;
    enable_recording:
      | 'cloud'
      | 'local'
      | 'rtp-tracks'
      | 'output-byte-stream'
      | '<not set>';
  };
};

export const createRoom = async (name: string): Promise<Room> => {
  try {
    const res = await fetch(`${DAILY_API}/rooms`, {
      method: 'POST',
      body: JSON.stringify({name}),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.DAILY_API_KEY}`,
      },
    });

    return res.json();
  } catch (err) {
    console.error('Failed creating room', err);
    throw err;
  }
};
