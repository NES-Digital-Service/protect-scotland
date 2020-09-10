import {Platform} from 'react-native';
import * as SecureStore from 'expo-secure-store';
// import {fetch} from 'react-native-ssl-pinning';
import NetInfo from '@react-native-community/netinfo';
import RNGoogleSafetyNet from 'react-native-google-safetynet';
import RNIOS11DeviceCheck from 'react-native-ios11-devicecheck';
import {SAFETYNET_KEY, BUILD_VERSION, ENV, TEST_TOKEN} from '@env';

import {isMountedRef, navigationRef, ScreenNames} from '../../navigation';
import {urls} from '../../constants/urls';

export const verify = async (nonce: string) => {
  if (Platform.OS === 'android') {
    return {
      platform: 'android',
      deviceVerificationPayload: await RNGoogleSafetyNet.sendAttestationRequestJWT(
        nonce,
        SAFETYNET_KEY
      )
    };
  } else {
    if (ENV !== 'production' && TEST_TOKEN) {
      return {
        platform: 'test',
        deviceVerificationPayload: TEST_TOKEN
      };
    }
    return {
      platform: 'ios',
      deviceVerificationPayload: await RNIOS11DeviceCheck.getToken(),
      timestamp: Date.now()
    };
  }
};

const connected = async (retry = false): Promise<boolean> => {
  const networkState = await NetInfo.fetch();
  if (networkState.isInternetReachable && networkState.isConnected) {
    return true;
  }

  if (retry) {
    throw new Error('Network Unavailable');
  } else {
    await new Promise((r) => setTimeout(r, 1000));
    await connected(true);
    return true;
  }
};

export const request = async (url: string, cfg: any) => {
  await connected();
  const {authorizationHeaders = false, ...config} = cfg;

  if (authorizationHeaders) {
    let bearerToken = await SecureStore.getItemAsync('token');
    if (!bearerToken) {
      bearerToken = await createToken();
    }

    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Authorization = `Bearer ${bearerToken}`;
  }

  let isUnauthorised;
  let resp;
  try {
    resp = await fetch(url, {
      ...config // ,
      // timeoutInterval: 30000,
      // sslPinning: {
      //  certs: ['cert1', 'cert2', 'cert3', 'cert4', 'cert5']
      // }
    });
    isUnauthorised = resp && resp.status === 401;
  } catch (e) {
    if (!authorizationHeaders || e.status !== 401) {
      throw e;
    }
    isUnauthorised = true;
  }

  if (authorizationHeaders && isUnauthorised) {
    let newBearerToken = await createToken();
    const newConfig = {
      ...config,
      headers: {...config.headers, Authorization: `Bearer ${newBearerToken}`}
    };

    return fetch(url, {
      ...newConfig // ,
      // timeoutInterval: 30000,
      // sslPinning: {
      //  certs: ['cert1', 'cert2', 'cert3', 'cert4', 'cert5']
      // }
    });
  }

  return resp;
};

async function createToken(): Promise<string> {
  try {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');

    const req = await request(`${urls.api}/refresh`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshToken}`
      },
      body: JSON.stringify({})
    });
    if (!req) {
      throw new Error('Invalid response');
    }
    const resp = await req.json();

    if (!resp.token) {
      throw new Error('Error getting token');
    }

    await SecureStore.setItemAsync('token', resp.token);

    saveMetric({event: METRIC_TYPES.TOKEN_RENEWAL});

    return resp.token;
  } catch (err) {
    // We get a 401 Unauthorized if the refresh token is missing, invalid or has expired
    // If this is the case, send the user back into onboarding to activate & generate a new one
    if (err.status === 401 && isMountedRef.current && navigationRef.current) {
      const currentRouteName = navigationRef.current.getCurrentRoute()?.name;
      if (currentRouteName !== ScreenNames.ageConfirmation) {
        navigationRef.current.reset({
          index: 0,
          routes: [{name: ScreenNames.ageConfirmation}]
        });
      }
    }
    return '';
  }
}

export async function register(): Promise<{
  token: string;
  refreshToken: string;
}> {
  const registerResponse = await request(`${urls.api}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });

  if (!registerResponse) {
    throw new Error('Invalid response');
  }
  const {nonce} = await registerResponse.json();

  try {
    const verifyResponse = await request(`${urls.api}/register`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({nonce, ...(await verify(nonce))})
    });

    if (!verifyResponse) {
      throw new Error('Invalid response');
    }

    const resp = await verifyResponse.json();

    return resp as {
      token: string;
      refreshToken: string;
    };
  } catch (err) {
    if (
      err.bodyString &&
      JSON.parse(err.bodyString).message === 'Invalid timestamp'
    ) {
      throw new Error('Invalid timestamp');
    }
    throw new Error('Invalid response');
  }
}

export async function forget(): Promise<boolean> {
  try {
    saveMetric({event: METRIC_TYPES.FORGET});
    await request(`${urls.api}/register`, {
      authorizationHeaders: true,
      method: 'DELETE'
    });
  } catch (err) {
    console.log('Error forgetting user: ', err);
    return false;
  }

  return true;
}

export enum METRIC_TYPES {
  CONTACT_UPLOAD = 'CONTACT_UPLOAD',
  FORGET = 'FORGET',
  TOKEN_RENEWAL = 'TOKEN_RENEWAL'
}

export async function saveMetric({event = ''}) {
  try {
    const analyticsOptin = await SecureStore.getItemAsync('analyticsConsent');
    if (!analyticsOptin || (analyticsOptin && analyticsOptin !== 'true')) {
      return false;
    }
    const os = Platform.OS;
    const version = BUILD_VERSION;
    const req = await request(`${urls.api}/metrics`, {
      authorizationHeaders: true,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        os,
        version,
        event
      })
    });

    return req && req.status === 204;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function loadSettings() {
  try {
    const req = await request(`${urls.api}/settings/language`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!req) {
      throw new Error('Invalid response');
    }

    const resp = await req.json();
    return resp;
  } catch (err) {
    console.log('Error loading settings data');
    console.log(err);
    throw err;
  }
}

export interface StatsData {
  installs: [Date, number][];
}

export async function loadData(): Promise<StatsData> {
  try {
    const req = await request(`${urls.api}/stats`, {
      authorizationHeaders: true,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!req) {
      throw new Error('Invalid response');
    }
    const res = await req.json();
    return res as StatsData;
  } catch (err) {
    console.log('Error loading stats data: ', err);
    throw err;
  }
}
