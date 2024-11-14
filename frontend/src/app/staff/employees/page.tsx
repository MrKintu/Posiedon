/*
 * Created Date: Tuesday, October 8th 2024, 3:50:11 am
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
  Search,
  Toolbar,
  Sort,
} from "@syncfusion/ej2-react-grids";
import { Header } from "@/components";
import { employeesData, employeesGrid } from "public/data/dummy";

const EmployeesPage: React.FC = () => {
  const { activeMenu } = useStateContext();

  // Hydration handling state
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set to true once the component mounts on the client
  }, []);

  // If the component hasn't hydrated yet, return null to prevent rendering issues
  if (!isClient) return null;

  return (
    <div className={activeMenu ? "md:ml-72" : "w-full flex-2"}>
      <div className="m-2 md:m-10 py-4 px-2 md:p-10 bg-white rounded-3xl dark:text-gray-200 dark:bg-secondary-dark-bg">
        <Header title={"Employees"} category={"Page"} />
        <GridComponent
          dataSource={employeesData}
          allowPaging
          allowSorting
          toolbar={["Search"]}
          width={"auto"}
        >
          <ColumnsDirective>
            {employeesGrid.map((item, index) => (
              <ColumnDirective key={index} {...item} />
            ))}
          </ColumnsDirective>
          <Inject services={[Page, Search, Toolbar, Sort]} />
        </GridComponent>
      </div>
    </div>
  );
};

export default EmployeesPage;
