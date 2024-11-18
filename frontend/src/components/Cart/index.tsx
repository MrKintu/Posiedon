/*
 * Created Date: Tuesday, October 8th 2024, 1:31:41 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import React, { useEffect, useState } from "react";
import { useStateContext } from "@/contexts/ContextProvider";
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from "react-icons/ai";
import { cartData } from "public/data/dummy";
import Image from "next/image";
import { SubHeading, Button } from "@/components";

// Define the cart item type
interface CartItem {
  image: string;
  name: string;
  category: string;
  price: string;
}

const Cart: React.FC = () => {
  const { handleClosingClick } = useStateContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="nav-item absolute top-16 right-5 md:right-52 bg-white dark:bg-secondary-dark-bg p-8 rounded-lg w-96">
      <SubHeading
        text="Shopping Cart"
        func={() => handleClosingClick("cart")}
      />

      <div className="flex flex-col">
        {(cartData as CartItem[]).map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-600 py-4"
          >
            <Image
              src={item.image}
              alt={item.name}
              width={96}
              height={80}
              className="rounded-xl object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold dark:text-gray-200">{item.name}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {item.category}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <p className="font-semibold dark:text-gray-200">{item.price}</p>
                <div className="flex items-center gap-2">
                  <button className="text-red-600 hover:text-red-700">
                    <AiOutlineMinusSquare size={20} />
                  </button>
                  <span className="text-gray-600 dark:text-gray-400">1</span>
                  <button className="text-green-600 hover:text-green-700">
                    <AiOutlinePlusSquare size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button
          text="Place Order"
          bgColor="bg-blue-600"
          color="text-white"
          borderRadius="rounded-lg"
          width="w-full"
        />
      </div>
    </div>
  );
};

export default Cart;
