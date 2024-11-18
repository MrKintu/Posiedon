/*
 * Created Date: Friday, October 25th 2024, 1:41:21 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import React, { useState, useEffect } from "react";
import { useStateContext } from "@/contexts/ContextProvider";
import { Header } from "@/components";
import { DataTable } from "@/components/DataTable";
import { productsData } from "public/data/dummy";
import { createColumnHelper } from "@tanstack/react-table";

// Define the Product type based on your data structure
type Product = {
  ProductID: number;
  ProductName: string;
  Category: string;
  Price: number;
  Status: string;
  StatusBg: string;
  ProductImage: string;
  Description: string;
  Stock: number;
};

const ProductsPage = () => {
  const { currentMode } = useStateContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const columnHelper = createColumnHelper<Product>();

  const columns = [
    columnHelper.accessor("ProductName", {
      header: "Product",
      cell: info => (
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 w-12 h-12">
            <img
              className="w-full h-full rounded-lg object-cover"
              src={info.row.original.ProductImage}
              alt={info.getValue()}
            />
          </div>
          <span>{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor("Category", {
      header: "Category",
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("Price", {
      header: "Price",
      cell: info => `$${info.getValue().toFixed(2)}`,
    }),
    columnHelper.accessor("Stock", {
      header: "Stock",
      cell: info => info.getValue(),
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
    columnHelper.accessor("Description", {
      header: "Description",
      cell: info => (
        <div className="max-w-xs truncate">
          {info.getValue()}
        </div>
      ),
    }),
  ];

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <Header category="Page" title="Products" />
      <div className="w-full">
        <DataTable
          data={productsData}
          columns={columns}
          enableSorting={true}
          enablePagination={true}
          showSearch={true}
          darkMode={currentMode === "Dark"}
        />
      </div>
    </div>
  );
};

export default ProductsPage;
