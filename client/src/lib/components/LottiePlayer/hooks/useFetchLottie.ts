import {AnimatedLottieViewProps, AnimationObject} from 'lottie-react-native';
import {useEffect, useState} from 'react';

function instanceOfAnimationObject(object: any): object is AnimationObject {
  return 'v' in object;
}

// This exists since there are several bugs when supplying source as
// {uri: 'https://some.json'}
// * The animation starts playing directly even when autoPlay is false
// * onAnimationFinnish do not fire
// Issue reported here https://github.com/lottie-react-native/lottie-react-native/issues/968
const useFetchLottie = (source: AnimatedLottieViewProps['source']) => {
  const [content, setContent] = useState<
    AnimatedLottieViewProps['source'] | null
  >(null);

  useEffect(() => {
    const fetchContent = async () => {
      if (typeof source !== 'string' && !instanceOfAnimationObject(source)) {
        try {
          const res = await fetch(source.uri);
          setContent(await res.json());
        } catch (err) {
          console.error(
            new Error(`Unable to fetch lottie file ${source.uri}`, {
              cause: err,
            }),
          );
        }
      } else {
        setContent(source);
      }
    };
    fetchContent();
  }, [source]);

  return content;
};

export default useFetchLottie;
