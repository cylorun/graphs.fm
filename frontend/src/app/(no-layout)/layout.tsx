import type {Metadata} from "next";
import {GoogleAnalytics} from '@next/third-parties/google';
import {Manrope, Source_Sans_3} from "next/font/google";

import Header from "@/components/header";
import Footer from "@/components/footer";
import {siteConfig} from '@/config/siteConfig';

import "../globals.css";
import React from "react";

const manrope = Manrope({subsets: ['latin']});
const sourceSans = Source_Sans_3({subsets: ['latin']});

export const metadata: Metadata = {
    title: siteConfig.metadata.title,
    description: siteConfig.metadata.description,
    openGraph: {
        title: siteConfig.metadata.title,
        description: siteConfig.metadata.description,
        url: siteConfig.siteUrl,
        type: 'website',
        images: [
            {
                url: '/images/og-image.jpg',
                width: 1200,
                height: 675,
                alt: siteConfig.siteName,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: siteConfig.metadata.title,
        description: siteConfig.metadata.description,
        images: ['/images/twitter-image.jpg'],
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${manrope.className} ${sourceSans.className} text-black antialiased !bg-transparent`}>
            {children}
        </body>
        </html>
    );
}
