/*
 * Created Date: Saturday, September 14th 2024, 2:14:37 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ApiClient from "@/utilities/api_client";
import { useAuthContext } from "@/contexts/AuthContext";

interface UserDetails {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string; 
  business: string;
  years: number;
  phone: string;
  industry: string;
  city: string;
  state: string;
  country: string;
  description: string;
}

const Signup = () => {
  const router = useRouter();
  const { setAuthContext } = useAuthContext();  // Destructure setAuthContext from context
  const [userDetails, setUserDetails] = useState<UserDetails>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    business: "",
    years: 0,
    phone: "",
    industry: "",
    city: "",
    state: "",
    country: "",
    description: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);  // State to handle hydration issue

  // Use useEffect to handle hydration issue
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: name === "years" ? parseInt(value, 10) : value,
    }));
  };

  const validateInputs = () => {
    const newErrors: string[] = [];
    const { first_name, last_name, email, password, confirm_password, business, years, phone, city, state, country, description } = userDetails;

    if (!first_name || !last_name || !email || !password || !confirm_password || !business || !years || !phone || !city || !state || !country || !description) {
      newErrors.push("All fields are required.");
    }

    if (password.length < 8) newErrors.push("Password must be at least 8 characters long.");
    if (password !== confirm_password) newErrors.push("Passwords do not match.");
    if (years <= 0) newErrors.push("Years in business must be a positive integer.");
    if (!/^\d+$/.test(phone)) newErrors.push("Phone number must be a valid number.");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInputs()) return;

    const payload = {
      first_name: userDetails.first_name,
      last_name: userDetails.last_name,
      email: userDetails.email,
      password: userDetails.password,
      is_staff: false,
      customer: {
        business: userDetails.business,
        years: userDetails.years,
        phone: parseInt(userDetails.phone, 10),
        description: userDetails.description,
        industry: userDetails.industry,
        city: userDetails.city,
        state: userDetails.state,
        country: userDetails.country,
      },
    };

    try {
      const response = await ApiClient.post("users/sign-up/", payload);

      if (response.error) throw new Error(response.error);

      setAuthContext({ isLoggedIn: true, username: userDetails.first_name });  // Update AuthContext on successful sign-up
      setSuccessMessage("Sign-up successful! Redirecting to your account...");
      setTimeout(() => router.push("/customers"), 2000);
    } catch (error) {
      setErrors(["An error occurred. Please try again later."]);
    }
  };

  const industryOptions = [
    "Transportation",
    "Pharmaceutical",
    "Telecommunications",
    "Manufacturing",
    "Mining",
    "Hospitality",
    "Media and News",
    "Agriculture",
    "Engineering and Technology",
    "Education",
    "Finance and Economics",
    "Health Care"
  ];

  if (!isClient) return null;  // Ensure that rendering happens only on the client side

  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="shadow-three mx-auto max-w-[500px] rounded bg-white px-6 py-10 dark:bg-dark sm:p-[60px]">
              <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                Create your free account
              </h3>
              {errors.length > 0 && (
                <div className="mb-4 text-red-500">
                  {errors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
              {successMessage && (
                <div className="mb-4 text-green-500">
                  <p>{successMessage}</p>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                {["first_name", "last_name", "email", "password", "confirm_password", "business", "years", "phone", "city", "state", "country"].map((field) => (
                  <div key={field} className="mb-8">
                    <label htmlFor={field} className="mb-3 block text-sm text-dark dark:text-white">
                      {field.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())} 
                    </label>
                    <input
                      type={field === "email" ? "email" : field === "password" || field === "confirm_password" ? "password" : field === "years" ? "number" : field === "phone" ? "tel" : "text"}
                      name={field}
                      id={field}
                      required
                      placeholder={`Enter your ${field.replace(/_/g, ' ')}`}
                      value={userDetails[field as keyof UserDetails]}
                      onChange={handleChange}
                      spellCheck="true"
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>
                ))}
                <div className="mb-8">
                  <label htmlFor="industry" className="mb-3 block text-sm text-dark dark:text-white">
                    Industry
                  </label>
                  <select
                    name="industry"
                    id="industry"
                    required
                    value={userDetails.industry}
                    onChange={handleChange}
                    className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                  >
                    <option value="">Select Industry</option>
                    {industryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-8">
                  <label htmlFor="description" className="mb-3 block text-sm text-dark dark:text-white">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    required
                    placeholder="Enter your company description"
                    value={userDetails.description}
                    onChange={handleChange}
                    spellCheck="true"
                    className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded bg-primary py-3 text-base font-semibold text-white transition-all duration-300 hover:bg-opacity-90"
                >
                  Sign Up
                </button>
              </form>
              <div className="mt-6 text-center text-base font-medium text-body-color">
                Already have an account? <Link href="/sign-in" className="text-primary">Sign In</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
