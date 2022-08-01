export default function (
  name = 'Test',
  background = 'ff0000',
  color = 'fff',
  bold = true,
) {
  return `https://eu.ui-avatars.com/api/?name=${name}&background=${background}&color=${color}&bold=${bold}`;
}
