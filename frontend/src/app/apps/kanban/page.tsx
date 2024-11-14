/*
 * Created Date: Tuesday, October 8th 2024, 3:21:13 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import { useStateContext } from "@/contexts/ContextProvider";
import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-kanban";

import { kanbanData, kanbanGrid } from "public/data/dummy";

import { Header } from "@/components";
import { useState, useEffect } from "react";

const KanbanPage: React.FC = () => {
  const { activeMenu } = useStateContext();
  const [isClient, setIsClient] = useState(false); // State to check if running on the client side

  useEffect(() => {
    setIsClient(true); // Set isClient to true once the component is mounted on the client
  }, []);

  if (!isClient) {
    return null; // Prevent rendering during SSR
  }

  return (
    <div className={activeMenu ? "md:ml-72" : "w-full flex-2"}>
      <div className="m-2 md:m-10 py-4 px-2 md:p-10 bg-white rounded-3xl dark:text-gray-200 dark:bg-secondary-dark-bg">
        <Header category={"App"} title={"Kanban"} />
        <KanbanComponent
          dataSource={kanbanData}
          id="kanban"
          keyField="Status"
          cardSettings={{ contentField: "Summary", headerField: "Id" }}
        >
          <ColumnsDirective>
            {kanbanGrid.map((item, index) => (
              <ColumnDirective key={index} {...item} />
            ))}
          </ColumnsDirective>
        </KanbanComponent>
      </div>
    </div>
  );
};

export default KanbanPage;
