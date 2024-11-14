/*
 * Created Date: Friday, October 25th 2024, 1:41:30 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import React, { useState, useEffect } from "react";
import { useStateContext } from "@/contexts/ContextProvider";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Inject,
  Toolbar,
  Sort,
  Edit,
} from "@syncfusion/ej2-react-grids";
import { Header } from "@/components";
import { customersData, customersGrid } from "public/data/dummy";

const CustomersPage: React.FC = () => {
  const { activeMenu } = useStateContext();
  const [isClient, setIsClient] = useState(false); // State to track if it's client-side rendering

  useEffect(() => {
    setIsClient(true); // Set to true once the component has mounted on the client
  }, []);

  // Prevent rendering Syncfusion Grid before client-side mounting
  if (!isClient) {
    return null; // Optionally render a loading spinner or placeholder
  }

  return (
    <div className={activeMenu ? "md:ml-72" : "w-full flex-2"}>
      <div className="m-2 md:m-10 py-4 px-2 md:p-10 bg-white rounded-3xl dark:text-gray-200 dark:bg-secondary-dark-bg">
        <Header title={"Customers"} category={"Page"} />
        <GridComponent
          dataSource={customersData}
          allowPaging
          allowSorting
          toolbar={["Add", "Edit", "Delete", "Update", "Cancel"]}
          width={"auto"}
          selectionSettings={{ type: "Multiple", mode: "Row" }}
          editSettings={{
            allowEditing: true,
            allowAdding: true,
            allowDeleting: true,
            mode: "Dialog",
          }}
        >
          <ColumnsDirective>
            {customersGrid.map((item, index) => (
              <ColumnDirective key={index} {...item} />
            ))}
          </ColumnsDirective>
          <Inject services={[Page, Toolbar, Sort, Edit]} />
        </GridComponent>
      </div>
    </div>
  );
};

export default CustomersPage;
