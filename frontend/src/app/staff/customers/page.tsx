/*
 * Created Date: Tuesday, October 8th 2024, 3:49:16 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import React, { useState, useEffect } from "react";
import { useStateContext } from "@/contexts/ContextProvider";
import { Header } from "@/components";
import { DataTable } from "@/components/DataTable";
import { customersData } from "public/data/dummy";
import { createColumnHelper } from "@tanstack/react-table";

// Define the Customer type based on your data structure
type Customer = {
  CustomerID: number;
  CustomerName: string;
  CustomerEmail: string;
  ProjectName: string;
  Status: string;
  StatusBg: string;
  Weeks: string;
  Budget: string;
  Location: string;
};

const CustomersPage: React.FC = () => {
  const { activeMenu } = useStateContext();

  // Hydration handling state
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set to true once the component mounts
  }, []);

  // If the component hasn't hydrated yet, return null to prevent rendering issues
  if (!isClient) return null;

  const columnHelper = createColumnHelper<Customer>();

  const columns = [
    columnHelper.accessor('CustomerName', {
      header: 'Customer',
      cell: info => (
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 w-10 h-10">
            <img
              className="w-full h-full rounded-full"
              src="/data/avatar.jpg"
              alt={info.getValue()}
            />
          </div>
          <div>
            <p className="font-semibold">{info.getValue()}</p>
            <p className="text-sm text-gray-500">{info.row.original.CustomerEmail}</p>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('ProjectName', {
      header: 'Project',
    }),
    columnHelper.accessor('Status', {
      header: 'Status',
      cell: info => (
        <span
          className="px-3 py-1 rounded-full text-sm font-medium"
          style={{
            backgroundColor: info.row.original.StatusBg,
            color: '#fff',
          }}
        >
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('Weeks', {
      header: 'Duration',
      cell: info => `${info.getValue()} weeks`,
    }),
    columnHelper.accessor('Budget', {
      header: 'Budget',
    }),
    columnHelper.accessor('Location', {
      header: 'Location',
    }),
  ];

  return (
    <div className={activeMenu ? "md:ml-72" : "w-full flex-2"}>
      <div className="m-2 md:m-10 py-4 px-2 md:p-10 bg-white rounded-3xl dark:text-gray-200 dark:bg-secondary-dark-bg">
        <Header title={"Customers"} category={"Page"} />
        <div className="mt-8">
          <DataTable
            data={customersData}
            columns={columns}
            title="Customer List"
            pageSize={8}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
