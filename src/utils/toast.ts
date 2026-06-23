import Toast from 'react-native-toast-message';

export const toast = {
  success: (message: string, title?: string) =>
    Toast.show({ type: 'success', text1: title ?? 'Success', text2: message }),

  error: (message: string, title?: string) =>
    Toast.show({ type: 'error', text1: title ?? 'Error', text2: message }),
};
