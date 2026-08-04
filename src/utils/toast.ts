import Toast from 'react-native-toast-message';

export const toast = {
  success: (message: string, title?: string) =>
    Toast.show({
      type: 'success',
      position: 'top',
      text1: title ?? 'All set!',
      text2: message,
    }),

  error: (message: string, title?: string) =>
    Toast.show({
      type: 'error',
      position: 'top',
      text1: title ?? 'Something went wrong',
      text2: message,
    }),
};
