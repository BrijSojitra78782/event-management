import { Colors } from '@/constants/Colors';
import { useAppContext } from '@/context/AppContext';
import { ActivityIndicator, View, StyleSheet, Dimensions } from 'react-native';

const Loader = () => {
  const {loading} = useAppContext();
  if(!loading)
    return null;
  return (
    <View style={styles.container}>
      <View style={styles.blurBackground} />
      <ActivityIndicator size="large" color={Colors.primary.background} />
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: width,
    height: height,
    zIndex: 1000,
    inset: 0,
    alignContent:'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(10px)',
  },
});

export default Loader;


