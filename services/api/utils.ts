import {Platform} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import {fetch} from 'react-native-ssl-pinning';
import AsyncStorage from '@react-native-community/async-storage';
import {getVersion} from 'react-native-exposure-notification-service';
import {backOff} from 'exponential-backoff';

import {isMountedRef, navigationRef, ScreenNames} from '../../navigation';
import {urls} from '../../constants/urls';

export enum METRIC_TYPES {
  FORGET = 'FORGET'
}

export async function request(url: string, cfg: any) {
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
      ...config,
      timeoutInterval: 30000,
      sslPinning: {
        certs: ['cert1', 'cert2', 'cert3', 'cert4', 'cert5']
      }
    });
    isUnauthorised = resp && resp.status === 401;
  } catch (e) {
    if (!authorizationHeaders || e.status !== 401) {
      throw e;
    }
    isUnauthorised = true;
  }

  if (authorizationHeaders && isUnauthorised) {
    const newBearerToken = await createToken();
    const newConfig = {
      ...config,
      headers: {...config.headers, Authorization: `Bearer ${newBearerToken}`}
    };

    return fetch(url, {
      ...newConfig,
      timeoutInterval: 30000,
      sslPinning: {
        certs: ['cert1', 'cert2', 'cert3', 'cert4', 'cert5']
      }
    });
  }

  return resp;
}

export async function requestRetry(url: string, cfg: any, retries: number = 1) {
  return backOff(() => request(url, cfg), {
    numOfAttempts: retries,
    startingDelay: 2000,
    timeMultiple: 2
  });
}

export async function requestWithCache<T extends unknown>(
  cacheKey: string,
  loadFunc: () => Promise<T>
) {
  try {
    const data = await loadFunc();
    // try caching the data
    try {
      console.log(`Saving ${cacheKey} data in storage...`);
      AsyncStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (err) {
      console.log(`Error writing "${cacheKey}" in storage:`, err);
    }

    return {data};
  } catch (error) {
    console.log(`Error loading "${cacheKey}" data: `, error);

    let data = null;

    // try loading data from cache
    try {
      console.log(`Loading "${cacheKey}" data from storage...`);
      const storageData = await AsyncStorage.getItem(cacheKey);
      if (storageData) {
        data = JSON.parse(storageData) as T;
      }
    } catch (err) {
      console.log(`Error reading "${cacheKey}" from storage:`, err);
    }

    return {
      data,
      error
    };
  }
}

export async function saveMetric({event = ''}) {
  try {
    const analyticsOptin = await SecureStore.getItemAsync('analyticsConsent');
    if (!analyticsOptin || (analyticsOptin && analyticsOptin !== 'true')) {
      return false;
    }
    const version = await getVersion();
    const os = Platform.OS;
    const req = await request(`${urls.api}/metrics`, {
      authorizationHeaders: true,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        os,
        version: version.display,
        event
      })
    });

    return req && req.status === 204;
  } catch (err) {
    console.log(err);
    return false;
  }
}

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
