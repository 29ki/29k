import {AnimatedLottieViewProps, AnimationObject} from 'lottie-react-native';
import {useEffect, useState} from 'react';

function instanceOfAnimationObject(object: any): object is AnimationObject {
  return 'v' in object;
}

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
