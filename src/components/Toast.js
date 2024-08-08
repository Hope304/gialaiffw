import React from 'react';
import {Toast, Box, Text} from 'native-base';

export const ToastWarning = (message, position, velo) => {
  Toast.show({
    render: () => {
      return (
        <Box bg="danger.400" px="2" py="2" rounded="sm" mb={12}>
          <Text
            textAlign={'center'}
            fontSize={18}
            color="white"
            fontFamily="SF-Pro-Display-Medium">
            {message}
          </Text>
        </Box>
      );
    },
    placement: position || 'bottom',
    duration: velo || 2222,
  });
};

export const ToastSuccess = (message, position, velo) => {
  Toast.show({
    render: () => {
      return (
        <Box bg="success.400" px="2" py="2" rounded="sm" mb={12}>
          <Text
            textAlign={'center'}
            fontSize={18}
            color="white"
            fontFamily="SF-Pro-Display-Medium">
            {message}
          </Text>
        </Box>
      );
    },
    placement: position || 'bottom',
    duration: velo || 2222,
  });
};

export const ToastAlert = (message, position, velo) => {
  Toast.show({
    render: () => {
      return (
        <Box bg="yellow.400" px="2" py="2" rounded="sm" mb={12}>
          <Text
            textAlign={'center'}
            fontSize={18}
            color="white"
            fontFamily="SF-Pro-Display-Medium">
            {message}
          </Text>
        </Box>
      );
    },
    placement: position || 'bottom',
    duration: velo || 2222,
  });
};
