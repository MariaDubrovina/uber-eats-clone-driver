import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import { useAuthContext } from '../contexts/AuthContext';
import ProfileScreen from '../screens/ProfileScreen';
import { ActivityIndicator, StyleSheet } from "react-native";

const Stack = createNativeStackNavigator();


const Navigation = () => {
    const {dbDriver} = useAuthContext();

    if (dbDriver === null) {
        return <ActivityIndicator color='grey' size='large' style={styles.indicator} />;
    }

    return (
        <Stack.Navigator screenOptions={{headerShown: false}}> 
            {dbDriver ? ( 
                <>        
                <Stack.Screen name='OrdersScreen' component={OrdersScreen} />         
                <Stack.Screen name='OrderDetailsScreen' component={OrderDetailsScreen} /> 
                </>  
            ) : ( 
                <Stack.Screen name='Profile' component={ProfileScreen} />
            )}              
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    
    indicator: {
        position: 'absolute', //to keep on the top of the page
        top: '50%',
        left: '50%',
      },
    
  });

export default Navigation;