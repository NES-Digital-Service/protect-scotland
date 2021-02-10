/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useCallback} from 'react';
import {
  NativeEventEmitter,
  ScrollView,
  View,
  Alert,
  StyleSheet,
  Platform,
  StatusBar
} from 'react-native';
import {format} from 'date-fns';
import ExposureNotification, {
  useExposure,
  CloseContact
} from 'react-native-exposure-notification-service';

import Button from '../atoms/button';
import Text from '../atoms/text';
import Spacing from '../atoms/spacing';
import {text} from '../../theme';
import {SPACING_HORIZONTAL} from '../../theme/layouts/shared';
import {Back} from '../atoms/back';
import {Title} from '../atoms/title';
import * as SecureStore from 'expo-secure-store';

// @ts-ignore
const emitter = new NativeEventEmitter(ExposureNotification);

export const Debug = () => {
  const exposure = useExposure();
  const [events, setLog] = useState([]);
  const [contacts, setContacts] = useState<CloseContact[]>([]);
  const [logData, setLogData] = useState(null);

  const loadData = useCallback(async () => {
    const apiContacts = await exposure.getCloseContacts();
    const apiLogData = await exposure.getLogData();
    console.log('logdata is', apiLogData);
    const runDates = apiLogData.lastRun;
    if (runDates && typeof runDates === 'string') {
      const dates = runDates
        .replace(/^,/, '')
        .split(',')
        .map((d) => {
          return format(parseInt(d, 10), 'dd/MM HH:mm:ss');
        });
      apiLogData.lastRun = dates.join(', ');
    } else {
      apiLogData.lastRun
        ? format(apiLogData.lastRun, 'dd/MM HH:mm:ss')
        : 'Unknown';
    }
    // @ts-ignore
    setLogData(apiLogData);
    console.log('apiLogData', apiLogData);
    console.log(
      'has api message',
      Boolean(apiLogData.lastApiError && apiLogData.lastApiError.length)
    );
    // @ts-ignore
    setContacts(apiContacts);
    console.log('contacts', apiContacts);
  }, [setLogData, setContacts]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleEvent(ev: {status?: any; scheduledTask?: any} = {}) {
    // @ts-ignore
    events.push(ev);
    setLog([...events]);
  }
  const checkExposure = async () => {
    try {
      setLog([]);
      // @ts-ignore
      subscription.remove();
      emitter.removeListener('exposureEvent', handleEvent);
    } catch (e) {}
    let subscription = emitter.addListener('exposureEvent', handleEvent);
    await exposure.checkExposure(true);
  };

  useEffect(() => {
    function handleSilentEvent(ev: any) {
      if (ev.exposure || (ev.info && ev.info.includes('saveDailyMetric'))) {
        loadData();
      }
    }

    let subscription = emitter.addListener('exposureEvent', handleSilentEvent);

    return () => {
      try {
        subscription.remove();
      } catch (e) {
        console.log('Remove error', e);
      }
    };
  }, []);

  const deleteAllData = async () => {
    Alert.alert('Delete Data', 'Are you asure you want to delete all data.', [
      {
        text: 'No',
        onPress: () => console.log('No Pressed'),
        style: 'cancel'
      },
      {
        text: 'Yes',
        onPress: async () => {
          setLog([]);
          await exposure.deleteAllData();
          setContacts([]);
          setLogData(null);
          await SecureStore.deleteItemAsync('createNoticeCertKey');
          exposure.configure(); // reconfigure as delete all deletes sharedprefs on android
        },
        style: 'cancel'
      }
    ]);
  };


  const stopENS = async () => {
    await exposure.stop();
  };

  const displayContact = (contact: CloseContact) => {
    const displayData = [
      // @ts-ignore
      `Alert: ${format(contact.exposureAlertDate, 'dd/MM HH:mm')}`,
      `Contact: ${format(contact.exposureDate, 'dd/MM')}`,
      // @ts-ignore
      `Score: ${contact.maxRiskScore}`,
      // @ts-ignore
      `Keys: ${contact.matchedKeyCount}`,
      // @ts-ignore
      `Durations: ${contact.attenuationDurations}`
    ];

    // @ts-ignore
    if (contact.maximumRiskScoreFullRange) {
      displayData.push(
        // @ts-ignore
        `maximumRiskScoreFullRange: ${contact.maximumRiskScoreFullRange}`
      );
      displayData.push(
        // @ts-ignore
        `riskScoreSumFullRange: ${contact.riskScoreSumFullRange}`
      );
      displayData.push(
        // @ts-ignore
        `customAttenuationDurations: ${contact.customAttenuationDurations}`
      );
    }

    if (contact.windows) {
      contact.windows.forEach((d) => {
        displayData.push(`When: ${format(d.date, 'dd/MM')}`);
        displayData.push(`calibrationConfidence: ${d.calibrationConfidence}`);
        displayData.push(`diagnosisReportType: ${d.diagnosisReportType}`);
        displayData.push(`infectiousness: ${d.infectiousness}`);
        displayData.push(`buckets: ${d.buckets}`);
        displayData.push(`numScans: ${d.numScans}`);
        displayData.push(`exceedsThreshold: ${d.exceedsThreshold}`);
      });
    }

    Alert.alert('Exposure Details', displayData.join('\n'), [
      {
        text: 'OK',
        onPress: () => console.log('OK Pressed'),
        style: 'cancel'
      }
    ]);
  };

  const listContactInfo = (contact: CloseContact) => {
    return `Alert: ${format(
      // @ts-ignore
      contact.exposureAlertDate,
      'dd/MM HH:mm'
    )}, Contact: ${format(contact.exposureDate, 'dd/MM')}, Score: ${
      // @ts-ignore
      contact.maxRiskScore
      // @ts-ignore
    }, Keys: ${contact.matchedKeyCount} ${contact.windows ? ', *' : ''}`;
  };

  return (
    <>
      <StatusBar barStyle="default" />
      <ScrollView style={styles.container}>
        <Back variant="light" />
        <Spacing s={44} />
        <Title title="viewNames:debug" />
        <Spacing s={24} />
        <Button variant="dark" onPress={checkExposure}>
          Check Exposure
        </Button>
        <Spacing s={24} />
        <Button type="secondary" variant="dark" onPress={deleteAllData}>
          Delete All Data
        </Button>
        <Button type="secondary" variant="dark" onPress={stopENS}>
          Stop ENS
        </Button>
        <Spacing s={24} />
        {logData && (
          <View style={styles.logScroll}>
            <ScrollView style={styles.contactsScroll}>
              {
                // @ts-ignore
                logData.installedPlayServicesVersion > 0 && (
                  <Text>
                    Play Services Version:{' '}
                    {
                      // @ts-ignore
                      logData.installedPlayServicesVersion
                    }
                  </Text>
                )
              }
              {
                // @ts-ignore
                logData.nearbyApiSupported === true ||
                  // @ts-ignore
                  (logData.nearbyApiSupported === false && (
                    <Text>
                      Exposure API Supported:{' '}
                      {
                        // @ts-ignore
                        `${logData.nearbyApiSupported}`
                      }
                    </Text>
                  ))
              }
              {
                // @ts-ignore
                <Text>Last Index: {logData.lastIndex}</Text>
              }
              {
                // @ts-ignore
                <Text>Last Ran: {logData.lastRun}</Text>
              }
              {
                // @ts-ignore
                Boolean(logData.lastError && logData.lastError.length) && (
                  <Text selectable={true}>
                    Last Message:{' '}
                    {
                      // @ts-ignore
                      `${logData.lastError}`
                    }
                  </Text>
                )
              }
              {Boolean(
                // @ts-ignore
                logData.lastApiError && logData.lastApiError.length
              ) && (
                <Text selectable={true}>
                  Last Exposure API Error:{' '}
                  {
                    // @ts-ignore
                    `${logData.lastApiError}`
                  }
                </Text>
              )}
            </ScrollView>
          </View>
        )}
        <Spacing s={12} />
        <View style={styles.contacts}>
          <Text style={styles.title}>Contacts</Text>
        </View>
        <ScrollView style={styles.contactsScroll}>
          {contacts &&
            contacts.map((c, index) => (
              <Text
                key={index}
                style={[text.default, styles.row]}
                onPress={() => displayContact(c)}>
                {listContactInfo(c)}
              </Text>
            ))}
        </ScrollView>
        <Spacing s={12} />
        <View style={styles.contacts}>
          <Text selectable={true} style={styles.title}>
            Logs
          </Text>
        </View>
        <ScrollView>
          <Text selectable={true}>{JSON.stringify(events, null, 2)}</Text>
        </ScrollView>
        <Spacing s={200} />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  stats: {
    marginTop: 24,
    paddingTop: 8,
    borderTopWidth: 1
  },
  contacts: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1
  },
  logScroll: {
    height: 112,
    borderTopWidth: 1,
    paddingTop: 12
  },
  contactsScroll: {
    height: 200
  },
  title: {
    ...text.default,
    fontSize: 24,
    marginBottom: 12
  },
  row: {
    height: 28
  },
  container: {
    paddingTop: Platform.OS === 'ios' ? 65 : 30,
    paddingHorizontal: SPACING_HORIZONTAL,
    paddingBottom: 64
  }
});
