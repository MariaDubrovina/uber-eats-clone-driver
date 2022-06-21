import { View, Text, TextInput, StyleSheet, Button, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Auth, DataStore } from 'aws-amplify';
import { Driver, Transports } from '../../models';
import { useAuthContext } from "../../contexts/AuthContext";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

const Profile = () => {
  const {sub, setDbDriver, dbDriver} = useAuthContext();

  const [name, setName] = useState(dbDriver?.name || "");
  const [transport, setTransport] = useState(
    Transports.DRIVING
  );
 
  const navigation = useNavigation();

  const onSave = async () => {
    await createDriver();
    navigation.navigate('OrdersScreen');
  };

  
  const createDriver = async () => {
    try {
      const driver = await DataStore.save(
        new Driver({
          name, 
          lat: 0, 
          lng: 0,
          transport, 
          sub}));
        setDbDriver(driver);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
    
  };


  return (
    <SafeAreaView>
      <Text style={styles.title}>Profile</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        style={styles.input}
      />
      <View style={{ flexDirection: "row" }}>
        <Pressable
          onPress={() => setTransport(Transports.BICYCLING)}
          style={{
            backgroundColor:
            transport === Transports.BICYCLING
                ? "#3FC060"
                : "white",
            margin: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: "#3FC060",
            borderRadius: 10,
          }}
        >
          <MaterialIcons name="pedal-bike" size={40} 
          color={transport === Transports.BICYCLING
                ? "white"
                : "#3FC060"
                } />
        </Pressable>
        <Pressable
          onPress={() => setTransport(Transports.DRIVING)}
          style={{
            backgroundColor:
            transport === Transports.DRIVING
                ? "#3FC060"
                : "white",
            margin: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: "#3FC060",
            borderRadius: 10,
          }}
        >
          <FontAwesome5 name="car" size={40} color={transport === Transports.BICYCLING
                ? "#3FC060"
                : "white"} />
        </Pressable>
      </View>
     
      <Pressable onPress={onSave} style={styles.button}>
        <Text style={styles.buttonText}>SAVE</Text>
      </Pressable>

      <Text onPress={() => Auth.signOut()} style={{color: 'red', textAlign: 'center', marginTop: 20}}>Sign Out</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10
    
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: "500",
    textAlign: "center",
    
  },
  input: {
    margin: 10,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
  },
  button: {
    marginHorizontal: 10,
    marginTop: 20,
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#3FC060'
  }
});

export default Profile;
