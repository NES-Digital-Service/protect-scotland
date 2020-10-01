import {PushNotification as PushNotificationType} from 'react-native-push-notification';
import {NotificationHooks} from 'services/notifications/hooks';
import {ScreenNames} from '../../navigation';

const MAX_ATTEMPTS = 50;
const ATTEMPTS_DELAY = 200;

export const reminderNotification = {
  id: 12345,
  handler: (notification: PushNotificationType, hooks: NotificationHooks) => {
    console.log(hooks);
    let attempts = 0;
    const handle = () => {
      if (hooks.navigation) {
        hooks.navigation.navigate(ScreenNames.tracing, {notification: true});
      } else if (attempts < MAX_ATTEMPTS) {
        attempts++;
        setTimeout(handle, ATTEMPTS_DELAY);
      }
    };
    handle();
  }
} as const;
