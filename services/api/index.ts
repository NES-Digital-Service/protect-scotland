import {Platform} from 'react-native';
import RNGoogleSafetyNet from 'react-native-google-safetynet';
import RNIOS11DeviceCheck from 'react-native-ios11-devicecheck';
import {SAFETYNET_KEY, ENV, TEST_TOKEN} from '@env';

import {urls} from '../../constants/urls';
import {request, requestRetry, saveMetric, METRIC_TYPES} from './utils';

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
    const deviceVerificationPayload = await RNIOS11DeviceCheck.getToken();

    return {
      platform: 'ios',
      deviceVerificationPayload
    };
  }
};

export class RegisterError extends Error {
  constructor(message: string, code: number) {
    super(message);
    this.name = 'RegisterError';
    // @ts-ignore
    this.code = code;
  }
}

export async function register(): Promise<{
  token: string;
  refreshToken: string;
}> {
  let nonce;
  try {
    const registerResponse = await request(`${urls.api}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    if (!registerResponse) {
      throw new Error('Invalid register response');
    }
    const registerResult = await registerResponse.json();

    nonce = registerResult.nonce;
  } catch (err) {
    console.log('Register error: ', err);
    if (err.json) {
      const errBody = await err.json();
      throw new RegisterError(errBody.message, errBody.code || 1001);
    }
    throw new RegisterError(err.message, 1002);
  }

  let deviceCheckData;
  try {
    deviceCheckData = await verify(nonce);
  } catch (err) {
    console.log('Device check error: ', err);
    throw new RegisterError(err.message, 1003);
  }

  try {
    const verifyResponse = await request(`${urls.api}/register`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({nonce, timestamp: Date.now(), ...deviceCheckData})
    });

    if (!verifyResponse) {
      throw new Error('Invalid verify response');
    }
    const verifyResult = await verifyResponse.json();

    return {
      token: verifyResult.token,
      refreshToken: verifyResult.refreshToken
    };
  } catch (err) {
    console.log('Register (verify) error:', err);
    if (err.json) {
      const errBody = await err.json();
      throw new RegisterError(errBody.message, errBody.code || 1004);
    }
    throw new RegisterError(err.message, 1005);
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

export async function loadSettings() {
  try {
    // Quickfix for iOS crash / SVG flicker on reopening onboarded app
    await promiseTimeout(1000);

    const req = await requestRetry(
      `${urls.api}/settings/language`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      3
    );
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

const promiseTimeout = (time: number) =>
  new Promise((ok) => setTimeout(ok, time, time));

export async function loadData(): Promise<StatsData> {
  try {
    // Quickfix for iOS crash / SVG flicker on reopening onboarded app
    await promiseTimeout(1000);

    const req = await requestRetry(
      `${urls.api}/stats`,
      {
        authorizationHeaders: true,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      3
    );

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

interface CreateNoticeResponse {
  key: string;
}

export async function createNotice(
  selfIsolationEndDate: string
): Promise<CreateNoticeResponse> {
  try {
    const reqPost = await request(`${urls.api}/notices/create`, {
      authorizationHeaders: true,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        selfIsolationEndDate
      })
    });

    if (!reqPost) {
      throw Error('Invalid response');
    }

    const {nonce} = await reqPost.json();

    const verification = await verify(nonce);

    const reqPut = await request(`${urls.api}/notices/create`, {
      authorizationHeaders: true,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nonce,
        selfIsolationEndDate,
        ...verification
      })
    });

    return await reqPut.json();
  } catch (err) {
    console.log('Error creating notice', err);
    return err;
  }
}

export async function validateNoticeKey(key: string): Promise<Boolean> {
  try {
    const reqValidate = await request(`${urls.api}/notices/validate`, {
      authorizationHeaders: true,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key
      })
    });

    const {valid} = await reqValidate.json();
    return valid;
  } catch (err) {
    console.log('Error validating key', err);
    return false;
  }
}
