/*
 * Created Date: Friday, October 25th 2024, 1:41:30 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import React, { useState, useEffect } from "react";
import { useStateContext } from "@/contexts/ContextProvider";
import { Header } from "@/components";
import { DataTable } from "@/components/DataTable";
import { subscriptionsData } from "public/data/dummy";
import { createColumnHelper } from "@tanstack/react-table";

// Define the Subscription type based on your data structure
type Subscription = {
  SubscriptionID: number;
  CustomerName: string;
  Plan: string;
  Status: string;
  StatusBg: string;
  StartDate: string;
  EndDate: string;
  Amount: number;
};

const SubscriptionsPage: React.FC = () => {
  const { currentMode } = useStateContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const columnHelper = createColumnHelper<Subscription>();

  const columns = [
    columnHelper.accessor("SubscriptionID", {
      header: "ID",
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("CustomerName", {
      header: "Customer",
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("Plan", {
      header: "Plan",
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("StartDate", {
      header: "Start Date",
      cell: info => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor("EndDate", {
      header: "End Date",
      cell: info => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor("Amount", {
      header: "Amount",
      cell: info => `$${info.getValue().toFixed(2)}`,
    }),
    columnHelper.accessor("Status", {
      header: "Status",
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
    <div className={currentMode === "Dark" ? "m-2 md:m-10 p-2 md:p-10 bg-secondary-dark-bg dark:text-gray-200 rounded-3xl" : "m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl"}>
      <Header category="Page" title="Subscriptions" />
      <div className="w-full">
        <DataTable
          data={subscriptionsData}
          columns={columns}
          enableSorting={true}
          enablePagination={true}
          showSearch={true}
          darkMode={currentMode === 'Dark'}
          enableColumnFilters={true}
          enableColumnVisibility={true}
        />
      </div>
    </div>
  );
};

export default SubscriptionsPage;
