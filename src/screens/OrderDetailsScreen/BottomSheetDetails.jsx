import { useRef, useMemo } from "react";
import { View, Text, Pressable} from "react-native";
import BottomSheet from '@gorhom/bottom-sheet';
import { FontAwesome5 } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { Entypo} from '@expo/vector-icons';
import styles from "./styles";
import { useOrderContext } from "../../contexts/OrderContext";
import { useNavigation} from "@react-navigation/native";

const STATUS_TO_TITLE = {
    READY_FOR_PICKUP: "Accept Order",
    ACCEPTED: "Pick-Up Order",
    PICKED_UP: "Complete Delivery"
};;


const BottomSheetDetails = ({totalKm, totalTime, zoomInOnDriver}) => {
    const {order, user, orderItems, onAcceptOrder, pickUpOrder, completeOrder} = useOrderContext();
    const snapPoints = useMemo(() => ['12%', '95%'], []);
    const bottomSheetRef = useRef(null);
    const isDriverClose = totalKm <= 1;
    const navigation = useNavigation();

    const onButtonPressed = async () => {
        if (order?.status === 'READY_FOR_PICKUP') {
            bottomSheetRef.current?.collapse();
            zoomInOnDriver();
           
            onAcceptOrder();
        }
        if (order?.status === 'ACCEPTED') {
            bottomSheetRef.current?.collapse();
            
            pickUpOrder();
          }
          if (order?.status === 'PICKED_UP') {
            await completeOrder();
            bottomSheetRef.current?.collapse();
            navigation.goBack();
            
          }
    };


   
      const isButtonDisabled = () => {
        if (order?.status === 'READY_FOR_PICKUP') {
          return false;
        }
        if (order?.status === 'ACCEPTED' && isDriverClose) {
          return false;
        }
        if (order?.status === 'PICKED_UP' && isDriverClose) {
          return false;
        }
        return true;
      };

    return (
        <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} handleIndicatorStyle={{backgroundColor:'#c0cacc', width:80}} >
                <View style={styles.row}>
                    <Text style={styles.minutes}>{totalTime.toFixed(0)} min</Text>
                    <FontAwesome5 name="shopping-bag" size={30} color="#3fc060" style={styles.iconBag} />
                    <Text style={styles.minutes}>{totalKm.toFixed(2)} km</Text>

                </View>

                <View style={styles.container}>
                    <Text style={styles.title}>{order.Restaurant.name}</Text>

                    <View style={styles.shopAddress}>
                        <Fontisto name="shopping-store" size={24} color="gray" />
                        <Text style={styles.address}>{order.Restaurant.address}</Text> 
                    </View>

                    <View style={styles.shopAddress}>
                        <Entypo name="location-pin" size={30} color="gray" />
                        <Text style={styles.address}>{user?.address}</Text> 
                    </View>

                    <View style={styles.orderItems}>
                      {orderItems?.map((item) => (
                          <Text style={styles.orderItem} key={item.id}>
                            {item.Dish.name} x{item.quantity}
                          </Text>
                      ))}
                    
                    </View>

                    
                </View>

                <Pressable onPress={onButtonPressed} 
                             style={{
                                ...styles.button,
                                backgroundColor: isButtonDisabled() ? "grey" : "#3FC060",
                              }} 
                            disabled={isButtonDisabled()}>
                    <Text style={styles.buttonText}>{STATUS_TO_TITLE[order.status]}</Text>    
                </Pressable>

            </BottomSheet> 
    );
};

export default BottomSheetDetails;