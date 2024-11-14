/*
 * Created Date: Tuesday, October 29th 2024, 12:18:01 am
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
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after the component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render content until the component is mounted
  if (!isClient) {
    return null; // Optionally, you could show a loading spinner or placeholder
  }

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
