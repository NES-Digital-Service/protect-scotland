/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useCallback} from 'react';
import {
  NativeEventEmitter,
  ScrollView,
  Text,
  View,
  Alert,
  StyleSheet,
  Platform
} from 'react-native';
import {format} from 'date-fns';
import ExposureNotification, {
  useExposure
} from 'react-native-exposure-notification-service';

import Button from '../atoms/button';

import Spacing from '../atoms/spacing';
import {text} from '../../theme';
import {Back} from '../atoms/back';
import {Title} from '../atoms/title';

const emitter = new NativeEventEmitter(ExposureNotification);

export const Debug = () => {
  const exposure = useExposure();
  const [events, setLog] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [logData, setLogData] = useState(null);

  const loadData = useCallback(async () => {
    // eslint-disable-next-line no-shadow
    const contacts = await exposure.getCloseContacts();

    // eslint-disable-next-line no-shadow
    const logData = await exposure.getLogData();
    console.log('logdata is', logData);
    const runDates = logData.lastRun;
    if (runDates && typeof runDates === 'string') {
      const dates = runDates
        .replace(/^,/, '')
        .split(',')
        .map((d) => {
          console.log('DDD', d);
          return format(parseInt(d, 10), 'dd/MM HH:mm:ss');
        });
      logData.lastRun = dates.join(', ');
    } else {
      logData.lastRun ? format(logData.lastRun, 'dd/MM HH:mm:ss') : 'Unknown';
    }
    // @ts-ignore
    setLogData(logData);
    console.log('logdata', logData);
    console.log(
      'has api message',
      Boolean(logData.lastApiError && logData.lastApiError.length)
    );
    // @ts-ignore
    setContacts(contacts);
    console.log('contacts', contacts);
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
    await exposure.checkExposure(true, true);
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
          exposure.configure(); // reconfigure as delete all deletes sharedprefs on android
        },
        style: 'cancel'
      }
    ]);
  };

  const displayContact = (contact: Object) => {
    const aDay = 24 * 60 * 60 * 1000;

    const contactDate =
      // @ts-ignore
      contact.exposureAlertDate - contact.daysSinceLastExposure * aDay;

    const displayData = [
      // @ts-ignore
      `When: ${format(contact.exposureAlertDate, 'dd/MM HH:mm')}`,
      `Last: ${format(contactDate, 'dd/MM')}`,
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

    // @ts-ignore
    if (contact.details) {
      // @ts-ignore
      contact.details.forEach((d) => {
        displayData.push(`When: ${format(d.date, 'dd/MM')}`);
        displayData.push(`Duration: ${d.duration}`);
        displayData.push(`Attentuation: ${d.attenuationValue}`);
        displayData.push(`Risk Score: ${d.totalRiskScore}`);
        displayData.push(`Attentuation Durations: ${d.attenuationDurations}`);
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

  const listContactInfo = (contact: Object) => {
    const aDay = 24 * 60 * 60 * 1000;

    const contactDate =
      // @ts-ignore
      contact.exposureAlertDate - contact.daysSinceLastExposure * aDay;
    return `When: ${format(
      // @ts-ignore
      contact.exposureAlertDate,
      'dd/MM HH:mm'
    )}, Last: ${format(contactDate, 'dd/MM')}, Score: ${
      // @ts-ignore
      contact.maxRiskScore
      // @ts-ignore
    }, Keys: ${contact.matchedKeyCount} ${contact.details ? ', *' : ''}`;
  };

  return (
    <ScrollView style={styles.container}>
      <Back />
      <Title title="viewNames:debug" />
      <Spacing s={24} />
      <Button variant="dark" onPress={checkExposure}>
        Check Exposure
      </Button>
      <Spacing s={24} />
      <Button type="secondary" variant="dark" onPress={deleteAllData}>
        Delete All Data
      </Button>
      <Spacing s={24} />
      {logData && (
        <View style={styles.logScroll}>
          <ScrollView style={styles.contactsScroll}>
            {
              // @ts-ignore
              logData.installedPlayServicesVersion > 0 && (
                <Text style={text.default}>
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
                  <Text style={text.default}>
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
              <Text style={text.default}>Last Index: {logData.lastIndex}</Text>
            }
            {
              // @ts-ignore
              <Text style={text.default}>Last Ran: {logData.lastRun}</Text>
            }
            {
              // @ts-ignore
              Boolean(logData.lastError && logData.lastError.length) && (
                <Text style={text.default} selectable={true}>
                  Last Message:{' '}
                  {
                    // @ts-ignore
                    `${logData.lastError}`
                  }
                </Text>
              )
            }
            {
              // @ts-ignore
              Boolean(logData.lastApiError && logData.lastApiError.length) && (
                <Text style={text.default} selectable={true}>
                  Last Exposure API Error:{' '}
                  {
                    // @ts-ignore
                    `${logData.lastApiError}`
                  }
                </Text>
              )
            }
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
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 65 : 30,
    paddingLeft: 45,
    paddingRight: 45,
    paddingBottom: 64
  }
});
