export const CLOUDINARY_IMAGE_CONFIG = {
  name: 'cloudinary',
  config: {
    default_transformations: [
      [
        {
          transformation: 'global',
          quality: 'auto',
        },
      ],
    ],
  },
};

export const CLOUDINARY_VIDEO_CONFIG = {
  name: 'cloudinary',
  config: {
    default_transformations: [
      [
        {
          quality: 'auto',
        },
      ],
    ],
  },
};

export const CLOUDINARY_AUDIO_CONFIG = {
  name: 'cloudinary',
  config: {
    default_transformations: [],
  },
};
