import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'Dragons Rend',
  webDir: 'build',
  bundledWebRuntime: false,
  icon: {
    android: 'resources/icon.png',  // Relative to project root
    ios: 'resources/icon.png',
    // Optional windows/electron configs
  },
  plugins: {
    SplashScreen: {
      backgroundColor: "#ffffff", // Must be valid HEX color with #
      launchShowDuration: 3000,
      launchAutoHide: true,
      androidScaleType: "CENTER_CROP"
    }
  },
};

export default config;


