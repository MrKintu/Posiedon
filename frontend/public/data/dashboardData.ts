/*
 * Created Date: Thursday, November 14th 2024, 11:00:26 pm
 * Author: Declan Trevor Kintu
 * 
 * Copyright (c) 2024 Your Company
 */

import { MdOutlineSupervisorAccount } from "react-icons/md";
import { BsBoxSeam, BsCurrencyDollar, BsShield } from "react-icons/bs";
import { FiBarChart, FiCreditCard } from "react-icons/fi";
import { HiOutlineRefresh } from "react-icons/hi";
import { TiTick } from "react-icons/ti";

// Types
interface EarningData {
    icon: React.ReactNode;
    amount: string;
    percentage: string;
    title: string;
    iconColor: string;
    iconBg: string;
    pcColor: string;
}

interface RecentTransaction {
    icon: React.ReactNode;
    amount: string;
    title: string;
    desc: string;
    iconColor: string;
    iconBg: string;
    pcColor: string;
}

interface WeeklyStat {
    icon: React.ReactNode;
    amount: string;
    title: string;
    desc: string;
    iconBg: string;
    pcColor: string;
}

// Dashboard Data
export const earningData: EarningData[] = [
    {
        icon: <MdOutlineSupervisorAccount />,
        amount: "39,354",
        percentage: "-4%",
        title: "Customers",
        iconColor: "#03C9D7",
        iconBg: "#E5FAFB",
        pcColor: "red-600",
    },
    {
        icon: <BsBoxSeam />,
        amount: "4,396",
        percentage: "+23%",
        title: "Products",
        iconColor: "rgb(255, 244, 229)",
        iconBg: "rgb(254, 201, 15)",
        pcColor: "green-600",
    },
    {
        icon: <FiBarChart />,
        amount: "423,39",
        percentage: "+38%",
        title: "Sales",
        iconColor: "rgb(228, 106, 118)",
        iconBg: "rgb(255, 244, 229)",
        pcColor: "green-600",
    },
    {
        icon: <HiOutlineRefresh />,
        amount: "39,354",
        percentage: "-12%",
        title: "Refunds",
        iconColor: "rgb(0, 194, 146)",
        iconBg: "rgb(235, 250, 242)",
        pcColor: "red-600",
    },
];

export const recentTransactions: RecentTransaction[] = [
    {
        icon: <BsCurrencyDollar />,
        amount: "+$350",
        title: "Paypal Transfer",
        desc: "Money Added",
        iconColor: "#03C9D7",
        iconBg: "#E5FAFB",
        pcColor: "green-600",
    },
    {
        icon: <BsShield />,
        amount: "-$560",
        title: "Bill Payment",
        desc: "Money Deduction",
        iconColor: "rgb(0, 194, 146)",
        iconBg: "rgb(235, 250, 242)",
        pcColor: "red-600",
    },
    {
        icon: <FiCreditCard />,
        amount: "+$350",
        title: "Credit Card",
        desc: "Money Added",
        iconColor: "rgb(255, 244, 229)",
        iconBg: "rgb(254, 201, 15)",
        pcColor: "green-600",
    },
];

export const weeklyStats: WeeklyStat[] = [
    {
        icon: <FiBarChart />,
        amount: "+$37,892",
        title: "Weekly Revenue",
        desc: "Increased by 10%",
        iconBg: "rgb(254, 201, 15)",
        pcColor: "green-600",
    },
    {
        icon: <BsCurrencyDollar />,
        amount: "-$2,134",
        title: "Weekly Expenses",
        desc: "Decreased by 5%",
        iconBg: "rgb(228, 106, 118)",
        pcColor: "red-600",
    },
];

export const kanbanData = [
    {
        Id: "Task 1",
        Title: "Task - 29001",
        Status: "Open",
        Summary: "Analyze the new requirements gathered from the customer.",
        Type: "Story",
        Priority: "Low",
        Estimate: 3.5,
        Assignee: "Nancy Davloio",
        RankId: 1,
        Color: "#02897B",
        Tags: "Analyze,Customer",
        ClassName: "e-story, e-low, e-nancy-davloio",
    },
    {
        Id: "Task 2",
        Title: "Task - 29002",
        Status: "InProgress",
        Summary: "Improve application performance",
        Type: "Improvement",
        Priority: "Normal",
        Estimate: 6,
        Assignee: "Andrew Fuller",
        RankId: 1,
        Color: "#673AB8",
        Tags: "Improvement",
        ClassName: "e-improvement, e-normal, e-andrew-fuller",
    },
    {
        Id: "Task 3",
        Title: "Task - 29003",
        Status: "Open",
        Summary: "Arrange a web meeting with the customer to get new requirements.",
        Type: "Others",
        Priority: "Critical",
        Estimate: 5.5,
        Assignee: "Janet Leverling",
        RankId: 2,
        Color: "#1F88E5",
        Tags: "Meeting",
        ClassName: "e-others, e-critical, e-janet-leverling",
    },
];
