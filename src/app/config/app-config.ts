export const CLIENT_ID= "569201617352-2rjt14ot3j5dl5ld87e93thapfs3mo0c.apps.googleusercontent.com"

// // production
export let BASE_URL =  '#BASE_URL#';


interface AppConfig {
  BASE_URL?: string;
}

declare global {
  interface Window {
    appConfig?: AppConfig;
  }
}

export const loadAppConfig = (): Promise<void> => { 
    return new Promise((resolve) => {
      if (window.appConfig?.BASE_URL) {
        BASE_URL = window.appConfig.BASE_URL;
        resolve();
      } else {
        fetch('assets/config.json')
          .then((response) => response.json())
          .then((config) => {
            BASE_URL = config.BASE_URL;
            resolve();
          })
          .catch((error) => {
            console.error('Error loading config.json:', error);
            resolve();
          });
      }
    });
  };
