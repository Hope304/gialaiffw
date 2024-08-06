import {NativeBaseProvider} from 'native-base';
import React from 'react';
import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NotifierWrapper} from 'react-native-notifier';
import RootNavigator from './src/navigation/RootNavigation';
// import codePush from 'react-native-code-push';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NativeBaseProvider>
        <NotifierWrapper>
          <RootNavigator />
        </NotifierWrapper>
      </NativeBaseProvider>
    </GestureHandlerRootView>
  );
};

// let codePushOptions = {
//   checkFrequency: codePush.CheckFrequency.MANUAL,
//   installMode: codePush.InstallMode.ON_NEXT_RESTART,
//   minimumBackgroundDuration: 60 * 10,
// };

// export default codePush(codePushOptions)(App);
export default App;
