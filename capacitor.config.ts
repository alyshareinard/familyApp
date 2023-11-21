import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.techaly.www',
  appName: 'The Family App',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
