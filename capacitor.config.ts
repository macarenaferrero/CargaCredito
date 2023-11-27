import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cargacredito.app',
  appName: 'CargaCredito',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  "bundledWebRuntime": false,
	"backgroundColor":"#6d5e64",
	"plugins": {
		"SplashScreen": {
		  "launchShowDuration": 0,
		  "launchAutoHide": true,
		  "backgroundColor": "#6d5e64",
		  "androidSplashResourceName": "splash",
		  "androidScaleType": "CENTER_CROP",
		  "splashFullScreen": true,
		  "splashImmersive": true,
		  "layoutName": "launch_screen",
		  "useDialog": true
		}
	  }
};

export default config;
