import { createContext, useState, useEffect, useContext } from 'react';
import { DataStore } from 'aws-amplify';
import { Order, User, OrderItem } from '../models';
import { useAuthContext } from './AuthContext';


const OrderContext = createContext({});

const OrderContextProvider = ({children}) => {
    const {dbDriver} = useAuthContext();

    const [order, setOrder] = useState(null);
    const [user, setUser] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    

    const fetchOrder = async (id) => {
        if (!id) {
            setOrder(null);
            return;
          };
        const order = await DataStore.query(Order, id);
        setOrder(order);

        const user = await DataStore.query(User, order.userID);
        setUser(user);

        const orderItems = await DataStore.query(OrderItem, oi => oi.orderID('eq', order.id));
        setOrderItems(orderItems);
        
    };

    useEffect(() => {
        if (!order) {
            return;
        };
        const subscription = DataStore.observe(Order, order.id).subscribe(({opType, element}) => {
            if (opType === 'UPDATE') {
               fetchOrder(element.id);
            }
        });

        // Call unsubscribe to close the subscription
        return () => subscription.unsubscribe();

    },[order?.id]);


    const onAcceptOrder = () => {
        //update the order, change status, assign driver to order
        DataStore.save(
            Order.copyOf(order, (updated) => {
                updated.status = 'ACCEPTED';
                updated.Driver = dbDriver;
            })
        ).then(setOrder);
    };

    const pickUpOrder = () => {
        DataStore.save(
            Order.copyOf(order, (updated) => {
                updated.status = 'PICKED_UP';
               
            })
        ).then(setOrder);
    };

    const completeOrder = async () => {
        const completedOrder = await DataStore.save(
            Order.copyOf(order, (updated) => {
                updated.status = 'COMPLETED';
                
            })
        );
        setOrder(completedOrder);
    };
    
    return (
        <OrderContext.Provider value={{order, user, orderItems, onAcceptOrder, fetchOrder, pickUpOrder, completeOrder}}>
            {children}
        </OrderContext.Provider>
    );
};

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext);
