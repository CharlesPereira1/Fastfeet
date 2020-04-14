import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import Deliveries from '~/pages/Deliveries';
import ConfirmDelivery from '~/pages/ConfirmDelivery';
import DeliveryDetails from '~/pages/DeliveryDetails';

const Stack = createStackNavigator();

export default function DeliveryRoutes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTintColor: '#fff',
        headerTransparent: true,
      }}
      initialRouteName="Entregas"
    >
      <Stack.Screen
        options={{ headerShown: false }}
        name="Entregas"
        component={Deliveries}
      />
      <Stack.Screen
        name="Detalhes"
        options={{
          title: 'Detalhes da encomenda',
        }}
        component={DeliveryDetails}
      />
      <Stack.Screen
        name="ConfirmDelivery"
        options={{
          title: 'Confirmar entrega',
        }}
        component={ConfirmDelivery}
      />
    </Stack.Navigator>
  );
}
