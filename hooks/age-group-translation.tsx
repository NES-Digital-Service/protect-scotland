import {useTranslation} from 'react-i18next';
import {useApplication} from '../providers/context';

export type GetTranslation = (namespace: string, options?: object) => string;

export function useAgeGroupTranslation() {
  const {t} = useTranslation();
  const {user} = useApplication();

  const getTranslation: GetTranslation = (
    namespace: string,
    options: object = {}
  ) => {
    const defaultTranslation = t(`${namespace}:default`, options);
    if (!user?.ageGroup) {
      return defaultTranslation;
    }

    const notFound = namespace
      .split(':')
      .slice(1)
      .concat([user.ageGroup])
      .join('.');

    const translation = t(`${namespace}:${user.ageGroup}`, options);
    return translation === notFound ? defaultTranslation : translation;
  };

  return {getTranslation};
}
