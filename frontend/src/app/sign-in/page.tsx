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
import { secureStorage, sanitizeInput, isTokenExpired, rateLimit } from "@/utilities/auth";

const Signin = () => {
  const [isClient, setIsClient] = useState(false);
  const { setAuthContext } = useAuthContext();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const checkRateLimit = rateLimit();

  useEffect(() => {
    setIsClient(true);
    // Check for existing token on mount
    const existingToken = secureStorage.getItem("access_token");
    if (existingToken && !isTokenExpired(existingToken)) {
      router.push('/customers');
    }
  }, [router]);

  if (!isClient) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email);
    
    // Check rate limiting
    const userIdentifier = sanitizedEmail || 'anonymous';
    if (!checkRateLimit(userIdentifier)) {
      setError("Too many login attempts. Please try again later.");
      return;
    }

    try {
      const signInResponse = await ApiClient.post("users/sign-in/", { 
        email: sanitizedEmail, 
        password  // password is not sanitized as it might contain special characters
      });

      if (signInResponse.error) {
        console.error("Sign in error:", signInResponse.error);
        const errorMessage = typeof signInResponse.error === 'object' && signInResponse.error !== null
          ? signInResponse.error.detail || "An error occurred during sign in"
          : typeof signInResponse.error === 'string'
            ? signInResponse.error
            : "Invalid email or password";
        setError(errorMessage);
        return;
      }

      try {
        const { access, refresh, user } = signInResponse;
        if (!access || !refresh || !user) {
          console.error("Missing required auth data:", signInResponse);
          setError("Invalid response from server");
          return;
        }

        // Validate token before storing
        if (isTokenExpired(access)) {
          setError("Invalid token received from server");
          return;
        }

        // Store tokens securely
        secureStorage.setItem("access_token", access);
        secureStorage.setItem("refresh_token", refresh);
        secureStorage.setItem("user_data", user);
        
        // Update auth context with user data
        setAuthContext({
          isLoggedIn: true,
          username: user.username,
          userData: user
        });

        setSuccessMessage("Sign-in successful! Redirecting to your account...");
        setTimeout(() => router.push('/customers'), 2000);
      } catch (parseError) {
        console.error("Error parsing sign in response:", parseError);
        setError("There was a problem processing your sign in. Please try again.");
      }
    } catch (err) {
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your Email"
                    className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your Password"
                    className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                  />
                </div>

                <div className="mb-8 flex flex-col justify-between sm:flex-row sm:items-center">
                  <div className="mb-4 sm:mb-0">
                    <Link
                      href="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div>
                    <Link
                      href="/sign-up"
                      className="text-sm text-primary hover:underline"
                    >
                      Create an Account
                    </Link>
                  </div>
                </div>

                <div className="mb-6">
                  <button className="flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark">
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signin;
