import React from "react";
import {
  AiFillHome,
  AiOutlineInfoCircle,
  AiOutlineCalendar,
  AiOutlineShoppingCart,
  AiOutlineAreaChart,
  AiOutlineBarChart,
  AiOutlineStock,
  AiOutlineFileText,
  AiOutlineTool,
} from "react-icons/ai";
import {
  FiShoppingBag,
  FiEdit,
  FiPieChart,
  FiUser,
} from "react-icons/fi";
import {
  MdDashboard,
  MdContactMail,
} from "react-icons/md";
import {
  BiImage,
  BiColorFill,
  BiStar,
} from "react-icons/bi";
import {
  BsKanban,
  BsBarChart,
} from "react-icons/bs";
import { IoMdContacts } from "react-icons/io";
import { RiContactsLine, RiStockLine } from "react-icons/ri";
import { GiLouvrePyramid } from "react-icons/gi";

export const links = [
  {
    title: "Browse",
    links: [
      {
        name: "Home",
        path: "",
        icon: <AiFillHome />,
      },
      {
        name: "About",
        path: "about",
        icon: <AiOutlineInfoCircle />,
      },
      {
        name: "Products",
        path: "products",
        icon: <FiShoppingBag />,
      },
      {
        name: "Sign Up",
        path: "sign-up",
        icon: <FiShoppingBag />,
      },
      {
        name: "Sign In",
        path: "sign-in",
        icon: <FiShoppingBag />,
      },
    ],
  },
  {
    title: "Apps",
    links: [
      {
        name: "calendar",
        path: "apps/calendar",
        icon: <AiOutlineCalendar />,
      },
      {
        name: "Colour Picker",
        path: "apps/colour-picker",
        icon: <BiColorFill />,
      },
      {
        name: "Create Image",
        path: "apps/create-image",
        icon: <BiImage />,
      },
      {
        name: "Create Post",
        path: "apps/create-post",
        icon: <AiOutlineFileText />,
      },
      {
        name: "editor",
        path: "apps/editor",
        icon: <FiEdit />,
      },
      {
        name: "kanban",
        path: "apps/kanban",
        icon: <BsKanban />,
      },
      {
        name: "SEO Tools",
        path: "apps/seo-tools",
        icon: <AiOutlineTool />,
      },
    ],
  },
  {
    title: "Charts",
    links: [
      {
        name: "line",
        path: "charts/line",
        icon: <AiOutlineStock />,
      },
      {
        name: "area",
        path: "charts/area",
        icon: <AiOutlineAreaChart />,
      },
      {
        name: "bar",
        path: "charts/bar",
        icon: <AiOutlineBarChart />,
      },
      {
        name: "pie",
        path: "charts/pie",
        icon: <FiPieChart />,
      },
      {
        name: "financial",
        path: "charts/financial",
        icon: <RiStockLine />,
      },
      {
        name: "colour-mapping",
        path: "charts/colour-mapping",
        icon: <BsBarChart />,
      },
      {
        name: "pyramid",
        path: "charts/pyramid",
        icon: <GiLouvrePyramid />,
      },
      {
        name: "stacked",
        path: "charts/stacked",
        icon: <AiOutlineBarChart />,
      },
    ],
  },
];
