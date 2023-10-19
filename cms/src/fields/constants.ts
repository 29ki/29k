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

export const CLOUDINARY_CONTRIBUTOR_IMAGE_CONFIG = {
  name: 'cloudinary',
  config: {
    default_transformations: [
      [
        {
          transformation: 'profile_picture_square',
        },
      ],
    ],
  },
};

export const CLOUDINARY_COCREATOR_IMAGE_CONFIG = {
  name: 'cloudinary',
  config: {
    default_transformations: [
      [
        {
          transformation: 'cocreator_image',
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
