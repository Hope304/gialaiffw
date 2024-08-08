import React, {forwardRef} from 'react';
import { Text } from 'react-native';

const Test = forwardRef((props, ref) => {
  return <Text ref={ref}>hhhhhh</Text>;
});

export default Test;
