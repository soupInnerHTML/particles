module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      ['lodash'],
      'react-native-reanimated/plugin',
      '@babel/plugin-transform-flow-strip-types',
      ['@babel/plugin-proposal-decorators', {legacy: true}],
      ['@babel/plugin-proposal-class-properties', {loose: false}],
      // In contrast to MobX 4/5, "loose" must be false!    ^
      [
        'module-resolver',
        {
          alias: {
            // This needs to be mirrored in tsconfig.json
            '@models': './app/models',
            '@svg': './app/assets/svg',
            '@utils': './app/utils',
            '@hoc': './app/hoc',
            '@hooks': './app/hooks',
            '@types': './app/types',
            '@atoms': './app/views/atoms',
            '@molecules': './app/views/molecules',
            '@organisms': './app/views/organisms',
            '@templates': './app/views/templates',
            '@screens': './app/views/screens',
          },
        },
      ],
    ],
  };
};
