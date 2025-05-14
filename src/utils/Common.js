/**
 *
 * This is a common class where all the common functions can be kept as a global function
 *
 */
import Toast from 'react-native-toast-message';
import {
  Alert,
} from 'react-native';

export function showSuccessToast(message) {
  return Toast.show({
    type: 'success',
    text1: message,
    position: 'bottom',
  });
}

export function showErrorToast(message) {
  return Toast.show({
    type: 'error',
    text1: message,
    position: 'bottom',
  });
}

export function showInfoToast(message) {
  return Toast.show({
    type: 'info',
    text1: message,
    position: 'bottom',
  });
}

{/* This will capitalize the first letter */}
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function alertMessage(string, value) {
  alert(`${string} = ${value}`)
}