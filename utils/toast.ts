import Toast from 'react-native-root-toast';
import { Platform } from 'react-native';

export function showToast({
  message,
  duration = 2500,
  position = Toast.positions.TOP,
  backgroundColor = '#16A34A',
  textColor = '#fff',
  fontSize = 16,
  borderRadius = 16,
  shadow = true,
} : {
  message: string,
  duration?: number,
  position?: number,
  backgroundColor?: string,
  textColor?: string,
  fontSize?: number,
  borderRadius?: number,
  shadow?: boolean,
}) {
  Toast.show(message, {
    duration,
    position,
    shadow,
    animation: true,
    hideOnPress: true,
    delay: 0,
    backgroundColor,
    textColor,
    containerStyle: {
      borderRadius,
      marginTop: Platform.OS === 'android' ? 48 : 64,
      marginHorizontal: 16,
      minWidth: 180,
      maxWidth: 360,
      alignSelf: 'center',
    },
    textStyle: {
      color: textColor,
      fontSize,
      fontFamily: 'Inter-SemiBold',
      textAlign: 'center',
    },
  });
} 