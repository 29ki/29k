import fetch from 'node-fetch';

const DAILY_API_KEY = process.argv[2];

if (!DAILY_API_KEY)
  throw Error('Please provide a Daily API key from the proper environment');

const DAILY_API_URL = `https://api.daily.co/v1`;

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

const getRooms = async () => {
  const res = await fetch(`${DAILY_API_URL}/rooms`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DAILY_API_KEY}`,
    },
  });

  return (await res.json()).data as Room[];
};

const deleteRoom = async (roomName: Room['name']) => {
  const res = await fetch(`${DAILY_API_URL}/rooms/${roomName}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DAILY_API_KEY}`,
    },
  });

  console.log(await res.json());
};

const run = async () => {
  const rooms = await getRooms();

  for (let room of rooms) {
    deleteRoom(room.name);
  }
};

run();
