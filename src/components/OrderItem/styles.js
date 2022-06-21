import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    
    root: {
        flexDirection: 'row',
        borderColor: '#3fc060',
        borderWidth: 2,
        borderRadius: 12,
        margin: 10,
        
    },
    image: {
        height: '100%',
        width: '25%',
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
        
    },
    middleContainer: {
        flex: 1,
        marginLeft: 5,
        padding: 5
    },
    rightContainer: {
        marginLeft: 'auto',
        backgroundColor: '#3fc060',
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        alignItems: 'center',
        justifyContent: "center",
        paddingHorizontal: 5
    },
    title: {
       fontSize: 18,
       fontWeight: '500',
    },
    address: {
        color: 'gray',
        fontSize: 15,
        
     },

     deliveryDetails: {
       marginTop: 10,
       fontSize: 15,
       fontWeight: '500',
     },
     userName: {
        color: 'gray',
        fontSize: 15,
        
     },
     userAddress: {
        color: 'gray',
        fontSize: 15,
        
     },
    
});

export default styles;