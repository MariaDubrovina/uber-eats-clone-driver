import { Text, View, Image } from 'react-native';
import { useState, useEffect} from 'react';
import { Pressable } from 'react-native';
import styles from "./styles";
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DataStore } from 'aws-amplify';
import { User} from '../../models';


const OrderItem = ({order}) => {
    const [client, setClient] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        DataStore.query(User, order.userID).then(setClient);
    }, []);

    const onPress = () => {
        navigation.navigate('OrderDetailsScreen', {id: order.id});
      };

    return(
        <Pressable onPress={onPress} style={styles.root}>
           
                <Image style={styles.image} source={{ uri: order.Restaurant.image}} />
            

            <View style={styles.middleContainer}>
                <Text style={styles.title} numberOfLines={3} >{order.Restaurant.name}</Text>           
                <Text style={styles.address}>{order.Restaurant.address}</Text>
                <Text style={styles.deliveryDetails}>Delivery Details:</Text>
                <Text style={styles.userName}>{client?.name}</Text>
                <Text style={styles.userAddress}>{client?.address}</Text>
            </View>
            <View style={styles.rightContainer}>
                <Entypo name="check" size={30} color="white" />
            </View>
        </Pressable>
    )
};

export default OrderItem;

