import {differenceInCalendarDays, addDays, format} from 'date-fns';
import {CloseContact} from 'react-native-exposure-notification-service';

export const getExposureDate = (contacts?: CloseContact[]) => {
  if (contacts && contacts.length > 0) {
    const {exposureDate} = contacts[0];
    return new Date(exposureDate);
  }
};

export const getSelfIsolationRemainingDays = (
  isolationDuration: number,
  contacts?: CloseContact[]
) => {
  const exposureDate = getExposureDate(contacts);
  const remainingDays = exposureDate
    ? isolationDuration - differenceInCalendarDays(Date.now(), exposureDate)
    : -1;
  return remainingDays > 0 ? remainingDays : 0;
};

export const DATE_FORMAT = 'd MMMM yyyy';

export const getIsolationEndDate = (
  isolationDuration: number,
  contacts?: CloseContact[],
  fmt: string = DATE_FORMAT
) => {
  const exposureDate = getExposureDate(contacts);

  if (exposureDate) {
    const isolationEndDate = addDays(exposureDate, isolationDuration);
    return {
      raw: isolationEndDate,
      formatted: format(isolationEndDate, fmt)
    };
  }
};

export const hasCurrentExposure = (
  isolationDuration: number,
  contacts?: CloseContact[]
) => {
  if (!contacts || contacts.length === 0) {
    return false;
  }

  const exposureDate = getExposureDate(contacts);
  const daysDiff = differenceInCalendarDays(new Date(), exposureDate!);
  return daysDiff < isolationDuration;
};
