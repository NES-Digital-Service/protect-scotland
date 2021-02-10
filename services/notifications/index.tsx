import PushNotification, {
  PushNotification as PushNotificationType
} from 'react-native-push-notification';
import {reminderNotification} from './reminder';
import {notificationHooks} from './hooks';

interface Token {
  os: string;
  token: string;
}

const notificationTypes = [reminderNotification];

const getId = (notification: PushNotificationType): string => {
  // @ts-ignore
  return notification.id || notification.data.id;
};

PushNotification.configure({
  onNotification: (notification: PushNotificationType) => {
    console.log(`Responding to notification ${getId(notification)}`);
    const notificationType = notificationTypes.find(
      ({id}) => String(id) === getId(notification)
    );

    if (notificationType?.handler) {
      notificationType?.handler(notification, notificationHooks);
    } else if (notificationHooks.handleNotification) {
      notificationHooks.handleNotification(notification);
    }
  },
  onRegister: (token: Token) => {
    if (notificationHooks.handleRegister) {
      notificationHooks.handleRegister(token);
    }
  },
  // senderID: '1087125483031',
  permissions: {
    alert: true,
    badge: true,
    sound: true
  },
  popInitialNotification: true,
  requestPermissions: false
});

PushNotification.createChannel(
  {
    channelId: 'default',
    channelName: 'Default channel'
  },
  () => {}
);

export {notificationHooks};
