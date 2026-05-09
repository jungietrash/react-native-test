const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
    stream: require.resolve('readable-stream'),
    // If you see errors for "buffer" or "crypto" later, add them here too:
    // buffer: require.resolve('buffer'),
};

module.exports = config;