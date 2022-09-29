import {useTheme} from '@ui-kitten/components';

export default function () {
  const theme = useTheme();
  return {
    highlightColor: theme['background-basic-color-2'],
    backgroundColor: theme['background-basic-color-4'],
  };
}
