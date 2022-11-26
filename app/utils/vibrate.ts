import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

export default function () {
  // Vibration.vibrate(10); //android?

  ReactNativeHapticFeedback.trigger('impactHeavy', {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  });
}
