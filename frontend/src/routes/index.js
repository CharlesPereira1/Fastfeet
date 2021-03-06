/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import React from 'react';
import { Switch } from 'react-router-dom';

import DeliverymanForm from '~/pages/Deliveryman/Form';
import DeliverymanList from '~/pages/Deliveryman/List';
import OrderForm from '~/pages/Order/Form';
import OrderList from '~/pages/Order/List';
import ProblemList from '~/pages/Problem/List';
import RecipientForm from '~/pages/Recipient/Form';
import RecipientList from '~/pages/Recipient/List';
import SignIn from '~/pages/SignIn';
import Route from '~/routes/Route';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" component={SignIn} exact />
      {/* <Route path="/dashboard" component={Dashboard} isPrivate /> */}

      <Route path="/orders" component={OrderList} isPrivate />
      <Route path="/order/new" component={OrderForm} exact isPrivate />
      <Route path="/order/:id/edit" component={OrderForm} exact isPrivate />

      <Route path="/recipients" component={RecipientList} isPrivate />
      <Route path="/recipient/new" component={RecipientForm} exact isPrivate />
      <Route path="/recipient/:id/edit" component={RecipientForm} isPrivate />

      <Route path="/deliverymans" component={DeliverymanList} isPrivate />
      <Route path="/deliveryman/new" component={DeliverymanForm} isPrivate />
      <Route
        path="/deliveryman/:id/edit"
        component={DeliverymanForm}
        isPrivate
      />

      <Route path="/problems" component={ProblemList} isPrivate />
    </Switch>
  );
}
