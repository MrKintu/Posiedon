/*
 * Created Date: Friday, October 25th 2024, 1:41:06 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useStateContext } from '@/contexts/ContextProvider';
import { Header } from '@/components';
import { DataTable } from '@/components/DataTable';
import { ordersData } from 'public/data/dummy';
import { createColumnHelper } from '@tanstack/react-table';

// Define the Order type based on your data structure
type Order = {
  OrderID: number;
  CustomerName: string;
  TotalAmount: number;
  OrderItems: string;
  Location: string;
  Status: string;
  StatusBg: string;
  ProductImage: string;
};

const OrdersPage = () => {
  const { currentMode } = useStateContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const columnHelper = createColumnHelper<Order>();

  const columns = [
    columnHelper.accessor('OrderID', {
      header: 'Order ID',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('CustomerName', {
      header: 'Customer Name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('TotalAmount', {
      header: 'Total Amount',
      cell: info => `$${info.getValue()}`,
    }),
    columnHelper.accessor('OrderItems', {
      header: 'Order Items',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('Location', {
      header: 'Location',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('Status', {
      header: 'Status',
      cell: info => (
        <div className="flex items-center">
          <div
            className="w-2.5 h-2.5 rounded-full mr-2"
            style={{ backgroundColor: info.row.original.StatusBg }}
          />
          {info.getValue()}
        </div>
      ),
    }),
  ];

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <Header category="Page" title="Orders" />
      <div className="w-full">
        <DataTable
          data={ordersData}
          columns={columns}
          enableSorting={true}
          enablePagination={true}
          showSearch={true}
          darkMode={currentMode === 'Dark'}
        />
      </div>
    </div>
  );
};

export default OrdersPage;
