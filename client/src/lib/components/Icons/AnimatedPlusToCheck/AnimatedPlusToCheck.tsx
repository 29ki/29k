import React, {forwardRef, useMemo} from 'react';
import AnimatedLottieView from 'lottie-react-native';
import AnimatedIcon, {AnimatedIconProps} from '../AnimatedIcon';
import {COLORS} from '../../../../../../shared/src/constants/colors';

const source = {
  v: '5.8.1',
  fr: 24,
  ip: 0,
  op: 13,
  w: 210,
  h: 210,
  nm: 'Comp 1',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Layer 2',
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            {
              i: {x: [0.667], y: [1]},
              o: {x: [0.333], y: [0]},
              t: 6,
              s: [100],
            },
            {t: 7, s: [0]},
          ],
          ix: 11,
        },
        r: {
          a: 1,
          k: [
            {
              i: {x: [0.667], y: [1]},
              o: {x: [0.333], y: [0]},
              t: 0,
              s: [0],
            },
            {t: 8, s: [-123]},
          ],
          ix: 10,
        },
        p: {
          a: 1,
          k: [
            {
              i: {x: 0.667, y: 1},
              o: {x: 0.333, y: 0},
              t: 4,
              s: [105, 104.633, 0],
              to: [-5.5, 2.583, 0],
              ti: [5.5, -2.583, 0],
            },
            {t: 8, s: [72, 120.133, 0]},
          ],
          ix: 2,
          l: 2,
        },
        a: {a: 0, k: [0, 0, 0], ix: 1, l: 2},
        s: {
          a: 1,
          k: [
            {
              i: {x: [0.667, 0.667, 0.667], y: [1, 1, 1]},
              o: {x: [0.333, 0.333, 0.333], y: [0, 0, 0]},
              t: 0,
              s: [100, 100, 100],
            },
            {t: 8, s: [70, 100, 100]},
          ],
          ix: 6,
          l: 2,
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              ind: 0,
              ty: 'sh',
              ix: 1,
              ks: {
                a: 0,
                k: {
                  i: [
                    [0, 0],
                    [0, 0],
                  ],
                  o: [
                    [0, 0],
                    [0, 0],
                  ],
                  v: [
                    [60, 0],
                    [-60, 0],
                  ],
                  c: false,
                },
                ix: 2,
              },
              nm: 'Path 1',
              mn: 'ADBE Vector Shape - Group',
              hd: false,
            },
            {
              ty: 'st',
              c: {a: 0, k: [1, 1, 1, 1], ix: 3},
              o: {a: 0, k: 100, ix: 4},
              w: {a: 0, k: 19.891, ix: 5},
              lc: 2,
              lj: 2,
              bm: 0,
              nm: 'Stroke 1',
              mn: 'ADBE Vector Graphic - Stroke',
              hd: false,
            },
            {
              ty: 'tr',
              p: {a: 0, k: [0, 0], ix: 2},
              a: {a: 0, k: [0, 0], ix: 1},
              s: {a: 0, k: [100, 100], ix: 3},
              r: {a: 0, k: 0, ix: 6},
              o: {a: 0, k: 100, ix: 7},
              sk: {a: 0, k: 0, ix: 4},
              sa: {a: 0, k: 0, ix: 5},
              nm: 'Transform',
            },
          ],
          nm: 'Group 1',
          np: 2,
          cix: 2,
          bm: 0,
          ix: 1,
          mn: 'ADBE Vector Group',
          hd: false,
        },
      ],
      ip: 0,
      op: 576,
      st: 0,
      bm: 0,
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: 'Layer 1',
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            {
              i: {x: [0.667], y: [1]},
              o: {x: [0.333], y: [0]},
              t: 8,
              s: [100],
            },
            {t: 10, s: [0]},
          ],
          ix: 11,
        },
        r: {
          a: 1,
          k: [
            {
              i: {x: [0.667], y: [1]},
              o: {x: [0.333], y: [0]},
              t: 0,
              s: [0],
            },
            {t: 8, s: [-213]},
          ],
          ix: 10,
        },
        p: {
          a: 1,
          k: [
            {
              i: {x: 0.667, y: 1},
              o: {x: 0.333, y: 0},
              t: 4,
              s: [105, 105, 0],
              to: [-5.712, 2.703, 0],
              ti: [5.712, -2.703, 0],
            },
            {t: 8, s: [70.727, 121.22, 0]},
          ],
          ix: 2,
          l: 2,
        },
        a: {a: 0, k: [0, 0, 0], ix: 1, l: 2},
        s: {
          a: 1,
          k: [
            {
              i: {x: [0.667, 0.667, 0.667], y: [1, 1, 1]},
              o: {x: [0.333, 0.333, 0.333], y: [0, 0, 0]},
              t: 0,
              s: [100, 100, 100],
            },
            {t: 8, s: [100, 70, 100]},
          ],
          ix: 6,
          l: 2,
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              ind: 0,
              ty: 'sh',
              ix: 1,
              ks: {
                a: 0,
                k: {
                  i: [
                    [0, 0],
                    [0, 0],
                  ],
                  o: [
                    [0, 0],
                    [0, 0],
                  ],
                  v: [
                    [0, -60],
                    [0, 60],
                  ],
                  c: false,
                },
                ix: 2,
              },
              nm: 'Path 1',
              mn: 'ADBE Vector Shape - Group',
              hd: false,
            },
            {
              ty: 'st',
              c: {a: 0, k: [1, 1, 1, 1], ix: 3},
              o: {a: 0, k: 100, ix: 4},
              w: {a: 0, k: 19.891, ix: 5},
              lc: 2,
              lj: 2,
              bm: 0,
              nm: 'Stroke 1',
              mn: 'ADBE Vector Graphic - Stroke',
              hd: false,
            },
            {
              ty: 'tr',
              p: {a: 0, k: [0, 0], ix: 2},
              a: {a: 0, k: [0, 0], ix: 1},
              s: {a: 0, k: [100, 100], ix: 3},
              r: {a: 0, k: 0, ix: 6},
              o: {a: 0, k: 100, ix: 7},
              sk: {a: 0, k: 0, ix: 4},
              sa: {a: 0, k: 0, ix: 5},
              nm: 'Transform',
            },
          ],
          nm: 'Group 1',
          np: 2,
          cix: 2,
          bm: 0,
          ix: 1,
          mn: 'ADBE Vector Group',
          hd: false,
        },
      ],
      ip: 0,
      op: 576,
      st: 0,
      bm: 0,
    },
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: 'Layer 4',
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            {
              i: {x: [0.667], y: [1]},
              o: {x: [0.333], y: [0]},
              t: 7,
              s: [0],
            },
            {t: 8, s: [100]},
          ],
          ix: 11,
        },
        r: {a: 0, k: 0, ix: 10},
        p: {a: 0, k: [70.564, 121.36, 0], ix: 2, l: 2},
        a: {a: 0, k: [0, 0, 0], ix: 1, l: 2},
        s: {a: 0, k: [100, 100, 100], ix: 6, l: 2},
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              ind: 0,
              ty: 'sh',
              ix: 1,
              ks: {
                a: 0,
                k: {
                  i: [
                    [0, 0],
                    [0, 0],
                  ],
                  o: [
                    [0, 0],
                    [0, 0],
                  ],
                  v: [
                    [-21.565, -32.641],
                    [21.565, 32.641],
                  ],
                  c: false,
                },
                ix: 2,
              },
              nm: 'Path 1',
              mn: 'ADBE Vector Shape - Group',
              hd: false,
            },
            {
              ty: 'st',
              c: {a: 0, k: [1, 1, 1, 1], ix: 3},
              o: {a: 0, k: 100, ix: 4},
              w: {a: 0, k: 20, ix: 5},
              lc: 2,
              lj: 2,
              bm: 0,
              nm: 'Stroke 1',
              mn: 'ADBE Vector Graphic - Stroke',
              hd: false,
            },
            {
              ty: 'tr',
              p: {a: 0, k: [0, 0], ix: 2},
              a: {a: 0, k: [0, 0], ix: 1},
              s: {a: 0, k: [100, 100], ix: 3},
              r: {a: 0, k: 0, ix: 6},
              o: {a: 0, k: 100, ix: 7},
              sk: {a: 0, k: 0, ix: 4},
              sa: {a: 0, k: 0, ix: 5},
              nm: 'Transform',
            },
          ],
          nm: 'Group 1',
          np: 2,
          cix: 2,
          bm: 0,
          ix: 1,
          mn: 'ADBE Vector Group',
          hd: false,
        },
      ],
      ip: 0,
      op: 576,
      st: 0,
      bm: 0,
    },
    {
      ddd: 0,
      ind: 4,
      ty: 4,
      nm: 'Layer 3',
      sr: 1,
      ks: {
        o: {a: 0, k: 100, ix: 11},
        r: {a: 0, k: 0, ix: 10},
        p: {a: 0, k: [124.477, 105.001, 0], ix: 2, l: 2},
        a: {a: 0, k: [0, 0, 0], ix: 1, l: 2},
        s: {a: 0, k: [100, 100, 100], ix: 6, l: 2},
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              ind: 0,
              ty: 'sh',
              ix: 1,
              ks: {
                a: 0,
                k: {
                  i: [
                    [0, 0],
                    [0, 0],
                  ],
                  o: [
                    [0, 0],
                    [0, 0],
                  ],
                  v: [
                    [-32.348, 49],
                    [32.348, -49],
                  ],
                  c: false,
                },
                ix: 2,
              },
              nm: 'Path 1',
              mn: 'ADBE Vector Shape - Group',
              hd: false,
            },
            {
              ty: 'st',
              c: {a: 0, k: [1, 1, 1, 1], ix: 3},
              o: {a: 0, k: 100, ix: 4},
              w: {a: 0, k: 20, ix: 5},
              lc: 2,
              lj: 2,
              bm: 0,
              nm: 'Stroke 1',
              mn: 'ADBE Vector Graphic - Stroke',
              hd: false,
            },
            {
              ty: 'tr',
              p: {a: 0, k: [0, 0], ix: 2},
              a: {a: 0, k: [0, 0], ix: 1},
              s: {a: 0, k: [100, 100], ix: 3},
              r: {a: 0, k: 0, ix: 6},
              o: {a: 0, k: 100, ix: 7},
              sk: {a: 0, k: 0, ix: 4},
              sa: {a: 0, k: 0, ix: 5},
              nm: 'Transform',
            },
          ],
          nm: 'Group 1',
          np: 2,
          cix: 2,
          bm: 0,
          ix: 1,
          mn: 'ADBE Vector Group',
          hd: false,
        },
        {
          ty: 'tm',
          s: {a: 0, k: 0, ix: 1},
          e: {
            a: 1,
            k: [
              {
                i: {x: [0.667], y: [1]},
                o: {x: [0.333], y: [0]},
                t: 6,
                s: [0],
              },
              {t: 12, s: [100]},
            ],
            ix: 2,
          },
          o: {a: 0, k: 0, ix: 3},
          m: 1,
          ix: 2,
          nm: 'Trim Paths 1',
          mn: 'ADBE Vector Filter - Trim',
          hd: false,
        },
      ],
      ip: 0,
      op: 576,
      st: 0,
      bm: 0,
    },
  ],
  markers: [],
};

type AnimatedPlusToCheck = Omit<AnimatedIconProps, 'source'>;

export const AnimatedPlusToCheck: React.FC<AnimatedPlusToCheck> = forwardRef<
  AnimatedLottieView,
  AnimatedPlusToCheck
>(({fill = COLORS.BLACK, ...props}, ref) => {
  const colorFilters = useMemo(
    () => [
      {keypath: 'Layer 1', color: fill},
      {keypath: 'Layer 2', color: fill},
      {keypath: 'Layer 3', color: fill},
      {keypath: 'Layer 4', color: fill},
    ],
    [fill],
  );
  return (
    <AnimatedIcon
      colorFilters={colorFilters}
      ref={ref}
      source={source}
      {...props}
    />
  );
});
