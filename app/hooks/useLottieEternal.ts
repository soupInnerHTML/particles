import {useEffect, useRef} from 'react';
import LottieView from 'lottie-react-native';
import {AppState} from 'react-native';

export default function () {
  const ref = useRef<LottieView>(null);

  useEffect(() => {
    const event = AppState.addEventListener('change', state => {
      if (state === 'active') {
        ref.current?.play();
      }
    });

    return () => event.remove();
  }, []);

  return ref;
}
