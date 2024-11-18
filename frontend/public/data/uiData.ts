/*
 * Created Date: Thursday, November 14th 2024, 11:00:26 pm
 * Author: Declan Trevor Kintu
 * 
 * Copyright (c) 2024 Your Company
 */

import { CgProfile } from "react-icons/cg";
import { BsShield } from "react-icons/bs";

// Types
interface ContextMenuItem {
    text: string;
    iconCss?: string;
    target?: string;
    id?: string;
}

interface UserProfile {
    name: string;
    title: string;
    location: string;
    avatar: string;
}

interface UserProfileItem {
    iconName: string;
    title: string;
    desc: string;
    iconColor: string;
    iconBg: string;
}

// UI Data
export const contextMenuItems: ContextMenuItem[] = [
    { text: "Cut", iconCss: "e-icons e-cut" },
    { text: "Copy", iconCss: "e-icons e-copy" },
    { text: "Paste", iconCss: "e-icons e-paste" },
    { text: "Delete", iconCss: "e-icons e-delete" },
    { text: "Export", iconCss: "e-icons e-export" },
];

export const userProfileData: UserProfileItem[] = [
    {
        iconName: "CgProfile",
        title: "My Profile",
        desc: "Account Settings",
        iconColor: "#03C9D7",
        iconBg: "#E5FAFB",
    },
    {
        iconName: "BsShield",
        title: "My Inbox",
        desc: "Messages & Emails",
        iconColor: "rgb(0, 194, 146)",
        iconBg: "rgb(235, 250, 242)",
    }
];

export const notificationData = [
    {
        message: "New Order Received",
        desc: "2 hours ago",
        type: "order",
        isRead: false,
        image: "/images/avatar1.jpg"
    },
    {
        message: "Server Error Alert",
        desc: "4 hours ago",
        type: "alert",
        isRead: true,
        image: "/images/avatar2.jpg"
    },
    {
        message: "New User Registration",
        desc: "1 day ago",
        type: "user",
        isRead: true,
        image: "/images/avatar3.jpg"
    },
];

export const chatData = [
    {
        message: "Hi there! How can I help?",
        time: "9:00 AM",
        sender: "support",
        isRead: true,
        image: "/images/avatar1.jpg"
    },
    {
        message: "I need help with my order",
        time: "9:05 AM",
        sender: "user",
        isRead: true,
        image: "/images/avatar2.jpg"
    },
    {
        message: "What's your order number?",
        time: "9:07 AM",
        sender: "support",
        isRead: false,
        image: "/images/avatar1.jpg"
    }
];

export const tooltipData = {
    charts: "View detailed analytics",
    notifications: "Check your notifications",
    profile: "Manage your profile",
    settings: "Adjust application settings",
};

export const modalData = {
    confirmDelete: {
        title: "Confirm Delete",
        message: "Are you sure you want to delete this item? This action cannot be undone.",
        confirmButton: "Delete",
        cancelButton: "Cancel",
    },
    saveChanges: {
        title: "Save Changes",
        message: "Do you want to save your changes before leaving?",
        confirmButton: "Save",
        cancelButton: "Discard",
    },
};

export const formValidationMessages = {
    required: "This field is required",
    email: "Please enter a valid email address",
    password: "Password must be at least 8 characters long",
    phone: "Please enter a valid phone number",
    url: "Please enter a valid URL",
};

export const gridPagination = {
    pageSize: 10,
    pageSizes: [5, 10, 15, 20],
    currentPage: 1,
};

export const toastMessages = {
    success: {
        title: "Success",
        duration: 3000,
        position: "top-right",
    },
    error: {
        title: "Error",
        duration: 5000,
        position: "top-right",
    },
    warning: {
        title: "Warning",
        duration: 4000,
        position: "top-right",
    },
    info: {
        title: "Information",
        duration: 3000,
        position: "top-right",
    },
};
