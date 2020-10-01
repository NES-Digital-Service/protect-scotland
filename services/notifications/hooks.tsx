import {PushNotification as PushNotificationType} from 'react-native-push-notification';
import {NavigationContainerRef} from '@react-navigation/native';
export const notificationHooks: NotificationHooks = {};

interface Token {
  os: string;
  token: string;
}

export interface NotificationHooks {
  handleNotification?: (notification: PushNotificationType) => void;
  handleRegister?: (token: Token) => void;
  handleAction?: (notification: PushNotificationType) => void;
  navigation?: NavigationContainerRef;
}
