/*
 * Created Date: Thursday, November 14th 2024, 11:00:26 pm
 * Author: Declan Trevor Kintu
 * 
 * Copyright (c) 2024 Your Company
 */

import React from "react";
import Image from "next/image";

// Grid Components
interface GridOrderImageProps {
    ProductImage: string;
}

export const GridOrderImage: React.FC<GridOrderImageProps> = ({ ProductImage }) => (
    <div>
        <Image
            className="rounded-xl h-20 md:ml-3"
            src={ProductImage}
            alt="order-item"
            width={120}
            height={120}
        />
    </div>
);

interface GridOrderStatusProps {
    StatusBg: string;
    Status: string;
}

export const gridOrderStatus: React.FC<GridOrderStatusProps> = (props) => (
    <button
        type="button"
        style={{ background: props.StatusBg }}
        className="text-white py-1 px-2 capitalize rounded-2xl text-md"
    >
        {props.Status}
    </button>
);

// Grid Data
export const customersData = [
    {
        CustomerID: 1001,
        CustomerName: "Nirav Joshi",
        CustomerEmail: "nirav@gmail.com",
        CustomerImage: "/data/avatar.jpg",
        ProjectName: "Elite Admin",
        Status: "Active",
        StatusBg: "#8BE78B",
        Weeks: "40",
        Budget: "$2.4k",
        Location: "India",
    },
    // Add more customer data as needed
];

export const employeesData = [
    {
        EmployeeID: 1,
        Name: "Nancy Davolio",
        Title: "Sales Representative",
        HireDate: "01/02/2021",
        Country: "USA",
        ReportsTo: "Carson",
        EmployeeImage: "/data/avatar.jpg",
    },
    // Add more employee data as needed
];

export const ordersData = [
    {
        OrderID: 10248,
        CustomerName: "Vinet",
        TotalAmount: 32.38,
        OrderItems: "Fresh Tomato",
        Location: "USA",
        Status: "pending",
        StatusBg: "#FB9678",
        ProductImage: "/data/product1.jpg",
    },
    // Add more order data as needed
];

// Grid Configurations
export const customersGrid = [
    {
        headerText: "Customer Name",
        width: "150",
        template: GridOrderImage,
        textAlign: "Center",
    },
    {
        field: "ProjectName",
        headerText: "Project Name",
        width: "150",
        textAlign: "Center",
    },
    {
        field: "Status",
        headerText: "Status",
        width: "130",
        format: "yMd",
        textAlign: "Center",
        template: gridOrderStatus,
    },
    {
        field: "Weeks",
        headerText: "Weeks",
        width: "100",
        format: "C2",
        textAlign: "Center",
    },
    {
        field: "Budget",
        headerText: "Budget",
        width: "100",
        format: "yMd",
        textAlign: "Center",
    },
    {
        field: "Location",
        headerText: "Location",
        width: "150",
        textAlign: "Center",
    },
];

export const employeesGrid = [
    {
        headerText: "Employee",
        width: "150",
        template: GridOrderImage,
        textAlign: "Center",
    },
    {
        field: "Name",
        headerText: "Name",
        width: "0",
        textAlign: "Center",
    },
    {
        field: "Title",
        headerText: "Designation",
        width: "170",
        textAlign: "Center",
    },
    {
        field: "Country",
        headerText: "Country",
        width: "120",
        textAlign: "Center",
    },
    {
        field: "HireDate",
        headerText: "Hire Date",
        width: "135",
        format: "yMd",
        textAlign: "Center",
    },
    {
        field: "ReportsTo",
        headerText: "Reports To",
        width: "120",
        textAlign: "Center",
    },
];

export const ordersGrid = [
    {
        headerText: "Image",
        template: GridOrderImage,
        textAlign: "Center",
        width: "120",
    },
    {
        field: "OrderItems",
        headerText: "Item",
        width: "150",
        editType: "dropdownedit",
        textAlign: "Center",
    },
    {
        field: "CustomerName",
        headerText: "Customer Name",
        width: "150",
        textAlign: "Center",
    },
    {
        field: "TotalAmount",
        headerText: "Total Amount",
        format: "C2",
        textAlign: "Center",
        editType: "numericedit",
        width: "150",
    },
    {
        field: "Status",
        headerText: "Status",
        template: gridOrderStatus,
        width: "120",
        textAlign: "Center",
    },
    {
        field: "OrderID",
        headerText: "Order ID",
        width: "120",
        textAlign: "Center",
    },
    {
        field: "Location",
        headerText: "Location",
        width: "150",
        textAlign: "Center",
    },
];
