import {TEMPLE_ENDPOINT} from 'config';

// TODO: move to shared? and use it also on functions/src/room/index.ts
export type Temple = {
  id: string;
  name: string;
  url: string;
  active: boolean;
};

export const addTemple = async (name: string): Promise<Temple> => {
  try {
    const response = await fetch(TEMPLE_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({name}),
    });
    const {temple} = await response.json();
    return temple;
  } catch (cause) {
    throw new Error('Could not create a room', {cause});
  }
};

export const fetchTemples = async (): Promise<Temple[]> => {
  try {
    return (await fetch(TEMPLE_ENDPOINT)).json();
  } catch (cause) {
    throw new Error('Could not fetch temples', {cause});
  }
};
