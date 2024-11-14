/*
 * Created Date: Saturday, September 14th 2024, 2:20:02 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

"use client";

import { useState, useEffect } from "react";
import { builder } from "@builder.io/sdk";
import { RenderBuilderContent } from "../../components/builder";

// Builder Public API Key set in .env file
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

interface PageProps {
  params: {
    page: string[];
  };
  content: any; // Type this according to your expected content structure
}

export default function Page({ params, content }: PageProps) {
  const { page } = params;

  const [isClient, setIsClient] = useState(false);

  // Hydration: Set the client state to true after mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render Builder content until the component is mounted (client-side)
  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Render the Builder page */}
      <RenderBuilderContent content={content} model="page" />
    </>
  );
}

// Server-side fetch for page content (for static generation or SSR)
export async function generateMetadata({ params }: { params: { page: string[] } }) {
  const builderModelName = "page";
  const { page } = params;

  const content = await builder
    .get(builderModelName, {
      userAttributes: {
        urlPath: "/" + (page?.join("/") || ""),
      },
    })
    .toPromise();

  return {
    title: content?.data?.title || "Default Title", // Modify as needed
    description: content?.data?.description || "Default Description", // Modify as needed
  };
}

export async function generateStaticParams() {
  // Generate static paths if you're using static generation
  return [
    { page: ["some", "path"] }, // Add the paths here
  ];
}
