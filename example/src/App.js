import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import {Audio} from 'expo-av';
import TrackPlayer from 'react-native-track-player';

import { Button, PlayerControls, Progress, TrackInfo } from './components';
import { SetupService, QueueInitalTracksService } from './services';
import { useCurrentTrack } from './hooks';

const App = () => {
  const track = useCurrentTrack();
  const [sound, setSound] = useState(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    async function run() {
      const isSetup = await SetupService();
      setIsPlayerReady(isSetup);

      const queue = await TrackPlayer.getQueue();
      if (isSetup && queue.length <= 0) {
        await QueueInitalTracksService();
      }
    }

    run();
  }, []);

  if (!isPlayerReady) {
    return (
      <SafeAreaView style={styles.screenContainer}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screenContainer}>
      <StatusBar barStyle={'light-content'} />
      <View style={styles.contentContainer}>
        <View style={styles.topBarContainer}>
          <Button
            title="Queue"
            onPress={() => console.log('TODO: implement queue interface')}
            type="primary"
          />
        </View>
        <TrackInfo track={track} />
        <Progress />
      </View>
      <View style={styles.actionRowContainer}>
        <PlayerControls />
      </View>
      <Button
          title="Expo-av play"
          onPress={async () => {
            const { sound } = await Audio.Sound.createAsync(
                require('./assets/resources/pure.m4a')
            );
            setSound(sound);
            // await sound.playAsync();
          }}
          type="primary"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#212121',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 3,
    alignItems: 'center',
  },
  topBarContainer: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
  },
  actionRowContainer: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default App;
