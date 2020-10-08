import React, { useState, useEffect } from 'react'
import {
  Button,
  StyleSheet,
  Text,
  View
} from 'react-native'
import Slider from '@react-native-community/slider';
import { Dimensions } from 'react-native'

const App = () => {
  let markers = ['00:00:00', '00:25:00', '00:40:00', '00:50:00', '00:59:59']
  let min = 0
  let max = 3599
  let startTimeCode = '00:00:00'
  let endTimeCode = '00:59:59'

  const [ distance, setDistance ] = useState(0)
  const [ markerText, setMarkerText ] = useState('Marker text is displayed here')
  const [ left, setLeft ] = useState(0)

  // play and stop
  const [ timerIsOn, setTimerIsOn ] = useState(false)

  const playButtonClickHandler = () => {
    setTimerIsOn(true)
  }

  const stopButtonClickHandler = () => {
    setTimerIsOn(false)
  }

  const timeToTimeCode = (time) => {
    let hour = parseInt(time / 3600)
    let minutes = parseInt((time - 3600 * hour) / 60)
    let seconds = (time - 3600 * hour) % 60
    hour = hour > 9 ? hour : '0' + hour
    minutes = minutes > 9 ? minutes : '0' + minutes
    seconds = seconds > 9 ? seconds : '0' + seconds
    return hour + ':' + minutes + ':' + seconds
  }

  const timeCodeToTime = (timeCode) => {
    let times = timeCode.split(":")
    let hour = parseInt(times[0])
    let minutes = parseInt(times[1])
    let seconds = parseInt(times[2])
    return hour * 3600 + minutes * 60 + seconds
  }

  useEffect(() => {
    // set marker text
    let currentTimeCode = timeToTimeCode(distance)
    if (markers.includes(currentTimeCode)) {
      setMarkerText(currentTimeCode)
    } else {
      setMarkerText('Marker text is displayed here')
    }
    // set left for timecode
    let left = calculateLeft(distance)
    setLeft(left)
  })

  useEffect(() => {
    let interval = null
    if (timerIsOn) {
      interval = setInterval(() => {
        setDistance(distance => distance + 1)
      }, 1000)
    } else if (!timerIsOn && distance !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [timerIsOn, distance])

  const calculateLeft = (val) => {
    return val * (Dimensions.get('window').width-90)/max - 15
  }

  const timeSteps = () => {
    return markers.map((marker, index) => {
      let left = calculateLeft(timeCodeToTime(marker))
        return (
          <View key={index} style={{position: 'absolute',
                        height: 20,
                        width: 20,
                        marginTop: 27,
                        left: left,
                        marginLeft: 17,
                        backgroundColor: '#fff',
                        borderColor: '#fe9829',
                        borderWidth: 2,
                        borderRadius: 10,
                        borderStyle: 'solid',
                        zIndex: 1 }}>
          </View>
        )
    })
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.markerText}>{markerText}</Text>
      </View>
      <View>
        <View style={styles.rangeSlider}>
          <Text style={ { width: 80, textAlign: 'center', left: left, marginLeft: -10 } }>
            { timeToTimeCode(Math.floor(distance)) }
          </Text>
          {timeSteps()}
          <Slider
            style={{width: 350}}
            minimumValue={min}
            maximumValue={max}
            step={1}
            value={distance}
            minimumTrackTintColor="#2799ff"
            maximumTrackTintColor="#f0f9ff"
            onValueChange={val => setDistance(val)}
          />
        </View>
        <View style={styles.timeCodeDuration}>
          <Text style={styles.startTimeCode}>{startTimeCode}</Text>
          <Text style={styles.endTimeCode}>{endTimeCode}</Text>
        </View>
        <View>
          <View style={styles.buttonGroup}>
            <Button
              title='PLAY'
              onPress={playButtonClickHandler}
            />
            <Button
              title='STOP'
              onPress={stopButtonClickHandler}
            />
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  markerText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 100,
    color: '#2799ff'
  },
  rangeSlider: {
    marginTop: 10
  },
  timeCodeDuration: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: "center"
  }
})

export default App