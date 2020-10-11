// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://192.168.43.29:9000/',
  mediaHost: 'http://192.168.43.29:9000',
  firebase: {
    apiKey: "AIzaSyB8ADk1r9qWGhMhg3--yZXeU001B9ned6M",
    authDomain: "zuoyou-456ad.firebaseapp.com",
    databaseURL: "https://zuoyou-456ad.firebaseio.com",
    projectId: "zuoyou-456ad",
    storageBucket: "zuoyou-456ad.appspot.com",
    messagingSenderId: "373767670467",
    appId: "1:373767670467:web:c46b9585fe805d758bb076",
    measurementId: "G-KC5DJHGG8J"
  },

  //apiUrl: 'http://localhost:9000/',
  //mediaHost: 'http://localhost:9000',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
