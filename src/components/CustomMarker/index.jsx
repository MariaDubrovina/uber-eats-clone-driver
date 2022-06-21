import {Marker} from "react-native-maps";
import { View} from "react-native";
import { Entypo} from '@expo/vector-icons';

const CustomMarker = ({data, type}) => {
    
    return (
        <Marker
            coordinate={{
                latitude: data.lat,
                longitude: data.lng,
            }}
            title={data.name}
            description={data.address}
        >
            <View style={{backgroundColor: "green", padding: 5, borderRadius: 20}}>
                {type === 'RESTAURANT' ? (
                    <Entypo name="shop" size={24} color="white" />)
                : (
                    <Entypo name="location-pin" size={24} color="white" />
                )
                }
                
            </View>
        </Marker>

    );
};

export default CustomMarker;