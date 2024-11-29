/*
 * Created Date: Saturday, September 14th 2024, 2:20:02 am
 * Author: Kintu Declan Trevor
 * 
 * Copyright (c) 2024 Kintu Declan Trevor
 */

import { builder } from "@builder.io/sdk";
import { RenderBuilderContent } from "@/components/builder";
import { Metadata } from "next";

// Builder Public API Key set in .env file
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

interface PageProps {
  params: {
    page: string[];
  };
}

export default async function Page({ params }: PageProps) {
  const page = Array.isArray(params?.page) ? params.page : [];
  const urlPath = '/' + page.join('/');

  const content = await builder
    .get('page', {
      userAttributes: {
        urlPath,
      },
    })
    .promise();

  return (
    <div>
      <RenderBuilderContent content={content} />
    </div>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = Array.isArray(params?.page) ? params.page : [];
  const urlPath = '/' + page.join('/');

  const content = await builder
    .get('page', {
      userAttributes: {
        urlPath,
      },
    })
    .promise();

  return {
    title: content?.data?.title || 'Page',
    description: content?.data?.description,
  };
}

export async function generateStaticParams() {
  const pages = await builder.getAll('page', {
    fields: 'data.url',
    options: { noTargeting: true },
  });

  console.log('Pages from Builder:', JSON.stringify(pages, null, 2));

  return pages.map((page) => {
    console.log('Processing page:', JSON.stringify(page, null, 2));
    if (!page.data?.url || typeof page.data.url !== 'string') {
      console.log('Warning: page.data.url is not a string:', page.data?.url);
      return { page: [] };
    }
    return {
      page: page.data.url.split('/').filter(Boolean) || [],
    };
  });
}
