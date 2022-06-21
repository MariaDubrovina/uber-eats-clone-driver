import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    
    minutes: {
        fontSize: 25,
        letterSpacing: 1,
        
      },
      iconBag: {
          marginHorizontal: 10
      },
      row: {
          flexDirection: 'row',
          alignItems:'center',  
          justifyContent:'center',
          marginTop: 10,
          marginBottom: 20
      },
      container: {
          paddingHorizontal: 20,
          
      },
      title: {
          fontSize: 25,
          letterSpacing: 0.5,
          paddingVertical: 20
       },
       address: {
          fontSize: 20,
          letterSpacing: 0.5,
          fontWeight: '500',
          color: 'grey',
          paddingHorizontal: 20
       },
       shopAddress: {
          flexDirection: 'row',
          paddingVertical: 10
       },
       orderItems: {
           borderTopWidth: 1,
           borderColor: 'lightgrey',
           paddingVertical: 10,
           marginTop: 20
       },
       orderItem: {
          fontSize: 18,
          color: 'grey',
          paddingVertical: 3
       },
       button: {
          backgroundColor: '#3fc060',
          marginTop: 'auto',
          padding: 15,
          alignItems: 'center',
          borderRadius: 10,
          marginHorizontal: 10,
      },
      buttonText: {
          color: 'white',
          fontSize: 25,
          letterSpacing: 0.5,
          fontWeight: '500',
      },
      indicator: {
        position: 'absolute', //to keep on the top of the page
        top: '50%',
        left: '50%',
      },
});

export default styles;