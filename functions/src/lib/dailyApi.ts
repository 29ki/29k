import {Dayjs} from 'dayjs';
import fetch from 'node-fetch';

import config from './config';

const {DAILY_API_KEY} = config;

const DAILY_API_URL = `https://api.daily.co/v1`;

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

type DailyConfig = {domain_id: string};
type DailyConfigCache = {domainId: string | null};

export const createRoom = async (expireDate: Dayjs): Promise<Room> => {
  const res = await fetch(`${DAILY_API_URL}/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DAILY_API_KEY}`,
    },
    body: JSON.stringify({
      properties: {
        exp: expireDate.unix(),
        start_audio_off: true,
        start_video_off: false,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed creating room, ${await res.text()}`);
  }

  return res.json();
};

export const DAILY_CONFIG_CACHE: DailyConfigCache = {domainId: null};

export const getDomainId = async (): Promise<string> => {
  if (DAILY_CONFIG_CACHE.domainId) {
    return DAILY_CONFIG_CACHE.domainId;
  }

  const res = await fetch(`${DAILY_API_URL}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DAILY_API_KEY}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed getting daily domain, ${await res.text()}`);
  }

  try {
    const data = (await res.json()) as DailyConfig;
    DAILY_CONFIG_CACHE.domainId = data.domain_id;
    return data.domain_id;
  } catch (error) {
    throw new Error('Failed reading daily config', {cause: error});
  }
};

export const updateRoom = async (
  name: Room['name'],
  expireDate: Dayjs,
): Promise<Room> => {
  const res = await fetch(`${DAILY_API_URL}/rooms/${name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DAILY_API_KEY}`,
    },
    body: JSON.stringify({
      properties: {
        exp: expireDate.unix(),
        start_audio_off: true,
        start_video_off: false,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed updating room, ${await res.text()}`);
  }

  return res.json();
};

export const deleteRoom = async (name: string): Promise<Room> => {
  const res = await fetch(`${DAILY_API_URL}/rooms/${name}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DAILY_API_KEY}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed deleting room, ${await res.text()}`);
  }

  return res.json();
};
