import * as Font from "expo-font";
 
export default useFonts = async () =>
  await Font.loadAsync({
    'digital-7': require('./assets/fonts/digital-7.ttf'),
  });