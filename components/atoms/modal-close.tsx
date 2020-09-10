import React, {FC} from 'react';
import {Image, TouchableWithoutFeedback} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';

const CloseIcon = require('../../assets/images/icon-close/image.png');

interface ModalCloseProps {
  onPress?: () => void;
  notification?: boolean;
  icon?: React.ReactNode;
}

export const ModalClose: FC<ModalCloseProps> = ({
  onPress,
  notification = false,
  icon
}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {t} = useTranslation();

  const handlePress = () => (onPress ? onPress() : navigation.popToTop());

  return (
    <TouchableWithoutFeedback onPress={handlePress} accessibilityRole="button">
      <Image
        source={icon || CloseIcon}
        accessibilityIgnoresInvertColors={false}
        accessibilityLabel={t('common:close:label')}
        accessibilityHint={
          notification
            ? t('common:close:notification:hint')
            : t('common:close:hint')
        }
      />
    </TouchableWithoutFeedback>
  );
};
