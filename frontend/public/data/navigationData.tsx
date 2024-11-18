/*
 * Created Date: Thursday, November 14th 2024, 11:00:26 pm
 * Author: Declan Trevor Kintu
 * 
 * Copyright (c) 2024 Your Company
 */

import React from 'react';
import {
    AiOutlineCalendar,
    AiOutlineAreaChart,
    AiOutlineBarChart,
    AiOutlineStock,
    AiFillHome,
} from "react-icons/ai";
import {
    FiShoppingBag,
    FiEdit,
    FiPieChart,
    FiCreditCard,
    FiShoppingCart,
    FiUser,
} from "react-icons/fi";
import {
    MdDashboard,
    MdContactMail,
} from "react-icons/md";
import { BsKanban, BsBarChart, BsCurrencyDollar, BsShield } from "react-icons/bs";
import { BiColorFill } from "react-icons/bi";
import { IoMdContacts } from "react-icons/io";
import { RiContactsLine, RiStockLine } from "react-icons/ri";
import { GiLouvrePyramid } from "react-icons/gi";

export const links = [
    {
        title: "Dashboard",
        links: [
            {
                name: "home",
                path: "",
                icon: React.createElement(AiFillHome),
            },
            {
                name: "about",
                path: "about",
                icon: React.createElement(MdDashboard),
            },
            {
                name: "payments",
                path: "payments",
                icon: React.createElement(FiCreditCard),
            },
            {
                name: "products",
                path: "products",
                icon: React.createElement(FiShoppingBag),
            },
        ],
    },
    {
        title: "Customers",
        links: [
            {
                name: "Customer Dashboard",
                path: "customers",
                icon: React.createElement(RiContactsLine),
            },
            {
                name: "Customer Profile",
                path: "customers/profile",
                icon: React.createElement(FiUser),
            },
            {
                name: "Customer Orders",
                path: "customers/orders",
                icon: React.createElement(FiShoppingCart),
            },
            {
                name: "Customer Contact",
                path: "customers/contact",
                icon: React.createElement(MdContactMail),
            },
            {
                name: "Customer Ownerships",
                path: "customers/ownerships",
                icon: React.createElement(BsShield),
            },
        ],
    },
    {
        title: "Staff",
        links: [
            {
                name: "Staff Dashboard",
                path: "staff",
                icon: React.createElement(MdDashboard),
            },
            {
                name: "Staff Profile",
                path: "staff/profile",
                icon: React.createElement(FiUser),
            },
            {
                name: "Staff Orders",
                path: "staff/orders",
                icon: React.createElement(FiShoppingCart),
            },
            {
                name: "Staff Products",
                path: "staff/products",
                icon: React.createElement(FiShoppingBag),
            },
            {
                name: "Staff Employees",
                path: "staff/employees",
                icon: React.createElement(IoMdContacts),
            },
            {
                name: "Staff Customers",
                path: "staff/customers",
                icon: React.createElement(RiContactsLine),
            },
            {
                name: "Staff Contact",
                path: "staff/contact",
                icon: React.createElement(MdContactMail),
            },
            {
                name: "Staff Subscriptions",
                path: "staff/subscriptions",
                icon: React.createElement(BsCurrencyDollar),
            },
        ],
    },
    {
        title: "Apps",
        links: [
            {
                name: "calendar",
                path: "calendar",
                icon: React.createElement(AiOutlineCalendar),
            },
            {
                name: "kanban",
                path: "kanban",
                icon: React.createElement(BsKanban),
            },
            {
                name: "editor",
                path: "editor",
                icon: React.createElement(FiEdit),
            },
            {
                name: "color-picker",
                path: "color-picker",
                icon: React.createElement(BiColorFill),
            },
        ],
    },
    {
        title: "Charts",
        links: [
            {
                name: "line",
                path: "line",
                icon: React.createElement(AiOutlineStock),
            },
            {
                name: "area",
                path: "area",
                icon: React.createElement(AiOutlineAreaChart),
            },
            {
                name: "bar",
                path: "bar",
                icon: React.createElement(AiOutlineBarChart),
            },
            {
                name: "pie",
                path: "pie",
                icon: React.createElement(FiPieChart),
            },
            {
                name: "financial",
                path: "financial",
                icon: React.createElement(RiStockLine),
            },
            {
                name: "color-mapping",
                path: "color-mapping",
                icon: React.createElement(BsBarChart),
            },
            {
                name: "pyramid",
                path: "pyramid",
                icon: React.createElement(GiLouvrePyramid),
            },
            {
                name: "stacked",
                path: "stacked",
                icon: React.createElement(AiOutlineBarChart),
            },
        ],
    },
    {
        title: "E-commerce",
        links: [
            {
                name: "products",
                path: "products",
                icon: React.createElement(FiShoppingBag),
            },
            {
                name: "orders",
                path: "ecommerce/orders",
                icon: React.createElement(FiShoppingCart),
            },
            {
                name: "credit-card",
                path: "ecommerce/credit-card",
                icon: React.createElement(FiCreditCard),
            },
        ],
    },
];

export const themeColors = [
    {
        name: "blue-theme",
        color: "#1A97F5",
    },
    {
        name: "green-theme",
        color: "#03C9D7",
    },
    {
        name: "purple-theme",
        color: "#7352FF",
    },
    {
        name: "red-theme",
        color: "#FF5C8E",
    },
    {
        name: "indigo-theme",
        color: "#1E4DB7",
    },
    {
        color: "#FB9678",
        name: "orange-theme",
    },
];
