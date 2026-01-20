import Colors from '@/shared/colors/Colors';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

// const [investment,setInvestment]=useState('Tech');
export const ActivityFilters = () => {
  return (
    <View style={styles.card}>
        <Text style={styles.title}>Filter by</Text>
         {/* <Input
                      label="Investment Name"
                      type='text'
                      placeholder="Investment Name"
                    //   value={investment}
                    //   onChangeText={setInvestment(investment)}
                    //   error={errors.email}
                    //   required
                    //   autoFocus
                    /> */}
      <TextInput placeholder="Investment name" style={styles.input} />
      <TextInput placeholder="Date (e.g. Jul 15)" style={styles.input} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.white, padding: 16, marginBottom: 12, borderRadius: 8 },
  title: { fontSize: 16, fontWeight: 'bold', color: Colors.secondary, marginBottom: 8 },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
});
