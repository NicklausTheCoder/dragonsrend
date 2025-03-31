import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'Dragons Rend',
  webDir: 'build',
  bundledWebRuntime: false,

  icon: {
    android: 'resources/icon.png',  // Relative to project root
    ios:'resources/icon.png',
    // Optional windows/electron configs
  },

};

export default config;
