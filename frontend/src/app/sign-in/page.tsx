/*
 * Created Date: Saturday, September 14th 2024, 2:14:37 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ApiClient from "@/utilities/api_client";
import { useAuthContext } from "@/contexts/AuthContext";

const Signin = () => {
  const [isClient, setIsClient] = useState(false);
  const { setAuthContext } = useAuthContext();  // Destructure setAuthContext from context
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Hydration fix: ensure the component renders only on the client
    setIsClient(true);
  }, []);

  // Hydration fix: render the component only when on the client
  if (!isClient) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Post data to the sign-in endpoint
      const response = await ApiClient.post("users/sign-in/", { email, password });

      // Check for any errors in the response
      if (response.error) {
        setError("Invalid username or password.");
        return;
      }

      // Extract the tokens and username from the response
      const { access, refresh, username } = response;
      console.log("Logged in successfully:", response);

      // Store the tokens in local storage
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      // Update the authentication context to reflect the successful login
      setAuthContext({ isLoggedIn: true, username });  // This updates the context

      // Set success message
      setSuccessMessage("Sign-in successful! Redirecting to your account...");

      // Redirect to the customer's page using the username
      setTimeout(() => router.push(`/customers/${username}`), 2000);
    } catch (err) {
      // Handle any errors during the request
      setError("An error occurred. Please try again later.");
      console.error(err);
    }
  };

  return (
    <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="shadow-three mx-auto max-w-[500px] rounded bg-white px-6 py-10 dark:bg-dark sm:p-[60px]">
              <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                Sign in to your account
              </h3>
              <p className="mb-11 text-center text-base font-medium text-body-color">
                Authenticate for a faster checkout.
              </p>

              {error && (
                <p className="text-center text-red-500 mb-6">{error}</p>
              )}

              {successMessage && (
                <p className="text-center text-green-500 mb-6">{successMessage}</p>
              )}

              <form onSubmit={handleLogin}>
                <div className="mb-8">
                  <label
                    htmlFor="email"
                    className="mb-3 block text-sm text-dark dark:text-white"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your Email"
                    className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                  />
                </div>

                <div className="mb-8">
                  <label
                    htmlFor="password"
                    className="mb-3 block text-sm text-dark dark:text-white"
                  >
                    Your Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your Password"
                    className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                  />
                </div>

                <div className="mb-6">
                  <button
                    type="submit"
                    className="shadow-submit dark:shadow-submit-dark flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90"
                  >
                    Sign in
                  </button>
                </div>
              </form>

              <p className="text-center text-base font-medium text-body-color">
                Don’t you have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signin;
