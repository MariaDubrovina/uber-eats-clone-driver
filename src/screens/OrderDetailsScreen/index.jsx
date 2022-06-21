import { useRef, useEffect, useState } from "react";
import { View, ActivityIndicator} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import styles from "./styles";
import MapView from "react-native-maps";
import { useWindowDimensions } from "react-native";
import * as Location from 'expo-location';
import MapViewDirections from "react-native-maps-directions";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useOrderContext } from "../../contexts/OrderContext";
import BottomSheetDetails from "./BottomSheetDetails";
import CustomMarker from "../../components/CustomMarker";
import { DataStore } from 'aws-amplify';
import { Driver } from '../../models';
import { useAuthContext } from "../../contexts/AuthContext";


const OrderDetailsScreen = () => {
    const {order, user, fetchOrder} = useOrderContext();
    const {dbDriver} = useAuthContext();

    const [driverLocation, setDriverLocation] = useState(null);
    const [totalTime, setTotalTime] = useState(0);
    const [totalKm, setTotalKm] = useState(0);
 
    const mapRef = useRef(null);

    
    const {width, height} = useWindowDimensions();
    const navigation = useNavigation();

    const route = useRoute();
    const id = route.params?.id;

    const restaurantLocation = {
      latitude: order?.Restaurant?.lat,
      longitude: order?.Restaurant?.lng,
    };
    const clientLocation = {
      latitude: user?.lat,
      longitude: user?.lng,
    };


    useEffect(() => {
      fetchOrder(id);
    }, [id]);

    useEffect(() => {
        if (!driverLocation) {
            return;
        }
        DataStore.save(
            Driver.copyOf(dbDriver, (updated) => {
                updated.lat = driverLocation.latitude;
                updated.lng = driverLocation.longitude;
            })
        );
      }, [driverLocation]);

    
    useEffect(() => {        
        getDeliveryLocations();      
    }, []);

    const getDeliveryLocations = async () => {
        //Get current user location
        let location = await Location.getCurrentPositionAsync({});
        setDriverLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        });

        // Listen to location changes
        const foregroundSubscrition = await Location.watchPositionAsync(
            {
            // Tracking options
            accuracy: Location.Accuracy.High,
            distanceInterval: 500,
            },
            (updatedLocation) => {
                setDriverLocation({
                    latitude: updatedLocation.coords.latitude,
                    longitude: updatedLocation.coords.longitude
                })
            });
           
            return foregroundSubscrition;

    };

    const zoomInOnDriver = () => {
        mapRef.current.animateToRegion({
            latitude: driverLocation.latitude,
            longitude: driverLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
    };

    

    if (!order || !user || !driverLocation) {
        return <ActivityIndicator color='grey' size='large' style={styles.indicator} />;
    };

    return (
        <View style={{flex:1 }}>
             <MapView 
                ref={mapRef}
                style={{width, height}} 
                initialRegion={{
                    latitude: driverLocation.latitude,
                    longitude: driverLocation.longitude,
                    //zoom on map
                    latitudeDelta: 0.07,
                    longitudeDelta: 0.07
                }}
                showsUserLocation={true} 
                followsUserLocation >
                
                <MapViewDirections 
                    origin={driverLocation}
                    destination={
                      order?.status === 'ACCEPTED'
                          ? restaurantLocation
                          : clientLocation
                    }
                    waypoints={
                      order?.status === 'READY_FOR_PICKUP'
                          ? [restaurantLocation]
                          : []
                    }
                    strokeWidth={10}
                    strokeColor="#3FC060"
                    apikey={'AIzaSyA40_jSaAHHq6J3o3HKJujVrMHv9gcSV3E'}
                    onReady={(result) => {
                        setTotalTime(result.duration);
                        setTotalKm(result.distance);
                    }}
                />
               <CustomMarker 
                  data={order.Restaurant}
                  type='RESTAURANT' 
               />
               <CustomMarker 
                  data={user}
                  type='CLIENT' 
               />
                
            </MapView>
            {order?.status === 'READY_FOR_PICKUP' && (
                <Ionicons
                onPress={() => navigation.goBack()}
                name="arrow-back-circle"
                size={45}
                color="black"
                style={{ top: 40, left: 15, position: "absolute" }}
                />
            )}
            
            <BottomSheetDetails totalKm={totalKm} totalTime={totalTime} zoomInOnDriver={zoomInOnDriver}/>
                       
        </View>
    )
};



export default OrderDetailsScreen;