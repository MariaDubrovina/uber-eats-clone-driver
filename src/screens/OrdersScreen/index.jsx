import { useRef, useMemo, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import OrderItem from "../../components/OrderItem";
import MapView from "react-native-maps";
import { useWindowDimensions } from "react-native";
import * as Location from 'expo-location';
import { DataStore } from 'aws-amplify';
import { Order} from '../../models';
import CustomMarker from "../../components/CustomMarker";



const OrdersScreen = () => {
    const [orders, setOrders] = useState([]);
    const [driverLocation, setDriverLocation] = useState(null);
    const bottomSheetRef = useRef(null);

    const snapPoints = useMemo(() => ['12%', '95%'], []);
    const {width, height} = useWindowDimensions();

    
    useEffect(() => {         
        getLocationPermission();
        getDeliveryLocations();
    }, []);

    const fetchAllReadyOrders = () => {
        DataStore.query(Order, (order) => order.status('eq', 'READY_FOR_PICKUP')).then(setOrders);
    };

    useEffect(() => {
        fetchAllReadyOrders();
        const subscription = DataStore.observe(Order).subscribe(({opType, element}) => {
            if (opType === 'UPDATE') {
               fetchAllReadyOrders();
            }
        });

        // Call unsubscribe to close the subscription
        return () => subscription.unsubscribe();
    }, []);

    const getLocationPermission = async () => {
        //get user permission
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            // Permission not granted
            console.log('Nope');
            return;
        };
    };

    const getDeliveryLocations = async () => {
        //Get current user location
        let location = await Location.getCurrentPositionAsync({});
        setDriverLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        });

    };

    if (!driverLocation) {
        return <ActivityIndicator color='grey' size='large' style={styles.indicator} />;
    };


    return (
        <View style={{flex:1 }}>
            <MapView style={{width, height}} 
                    showsUserLocation={true} 
                    followsUserLocation 
                    initialRegion={{
                        latitude: driverLocation.latitude,
                        longitude: driverLocation.longitude,
                        //zoom on map
                        latitudeDelta: 0.07,
                        longitudeDelta: 0.07
                    }}
                    >
                {orders.map((order) => (
                <CustomMarker
                    key={order.id}
                    data={order.Restaurant}
                    type='RESTAURANT' 
                />
               
                 ))}
            </MapView>
                <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} >
                    <View style={{alignItems:'center', marginBottom: 20}}>
                        <Text style={styles.online}>You're Online</Text>
                        <Text style={styles.orders}>Available Nearby Orders: {orders.length}</Text>

                    </View>

                    <BottomSheetFlatList 
                            data={orders}
                            renderItem={({item}) => <OrderItem order={item} /> }
                            showsVerticalScrollIndicator={false} 
                        />

                </BottomSheet> 
                       
        </View>
    )
};

const styles = StyleSheet.create({
    online: {
      fontSize: 20,
      fontWeight: "600",
      letterSpacing: 0.5,
      paddingBottom: 10,
    },
    orders: {
        letterSpacing: 0.5,
        color: 'grey'
    },
    indicator: {
        position: 'absolute', //to keep on the top of the page
        top: '50%',
        left: '50%',
      },
    
  });

export default OrdersScreen;