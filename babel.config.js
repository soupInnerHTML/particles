module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['lodash'],
    ['import', {libraryName: '@ant-design/react-native'}],
    'react-native-reanimated/plugin',
    '@babel/plugin-transform-flow-strip-types',
    ['@babel/plugin-proposal-decorators', {legacy: true}],
    ['@babel/plugin-proposal-class-properties', {loose: false}],
    // In contrast to MobX 4/5, "loose" must be false!    ^
  ],
};
