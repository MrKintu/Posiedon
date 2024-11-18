/*
 * Created Date: Tuesday, October 8th 2024, 3:50:11 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import React, { useState, useEffect } from "react";
import { useStateContext } from "@/contexts/ContextProvider";
import { Header } from "@/components";
import { DataTable } from "@/components/DataTable";
import { employeesData } from "public/data/dummy";
import { createColumnHelper } from "@tanstack/react-table";

// Define the Employee type based on your data structure
type Employee = {
  EmployeeID: number;
  Name: string;
  Title: string;
  HireDate: string;
  Country: string;
  ReportsTo: string;
  EmployeeImage: string;
};

const EmployeesPage = () => {
  const { currentMode } = useStateContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const columnHelper = createColumnHelper<Employee>();

  const columns = [
    columnHelper.accessor("Name", {
      header: "Employee",
      cell: info => (
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 w-10 h-10">
            <img
              className="w-full h-full rounded-full object-cover"
              src={info.row.original.EmployeeImage}
              alt={info.getValue()}
            />
          </div>
          <div>
            <div className="font-medium">{info.getValue()}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {info.row.original.Title}
            </div>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("Title", {
      header: "Title",
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("Country", {
      header: "Country",
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("HireDate", {
      header: "Hire Date",
      cell: info => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor("ReportsTo", {
      header: "Reports To",
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("EmployeeID", {
      header: "Employee ID",
      cell: info => info.getValue(),
    }),
  ];

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <Header category="Page" title="Employees" />
      <div className="w-full">
        <DataTable
          data={employeesData}
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

export default EmployeesPage;
