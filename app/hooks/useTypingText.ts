import {useDerivedValue, useSharedValue} from 'react-native-reanimated';
import {useEffect} from 'react';

export function useTypingText() {
  const dots = useSharedValue('');
  const typingText = useDerivedValue(() => 'typing' + dots.value);

  useEffect(() => {
    const id = setInterval(() => {
      if (dots.value.length < 3) {
        dots.value += '.';
      } else {
        dots.value = '';
      }
    }, 500);

    return () => clearInterval(id);
  }, []);

  return typingText;
}
