import { ActivityIndicator, View, StyleSheet } from 'react-native';

const Loader = () => (
  <View style={styles.loader}>
    <ActivityIndicator size="large" color="#fff" />
  </View>
);

const styles = StyleSheet.create({
  loader: {
    marginVertical: 20,
  },
});

export default Loader;
