import * as React from 'react';

export type QueueCreate = (appendFunc: VoidFunction) => void;

const OrderContext = React.createContext<QueueCreate>(null);

export default OrderContext;
