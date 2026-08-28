import MobileFooter from "@/components/organism/MobileFooter";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DashboardContextProvider } from "../app/context/DashboardContext";
import "../app/globals.css";
import Foter from "../components/molecules/Foter";
import ThemeWrapper from "../components/molecules/ThemeWrapper";
import TopLoaderProvider from "../components/molecules/TopLoaderProvider";
import { CartProvider } from "../context/CartProvider";
import AuthProvider from "../hooks/useAuth";
import GlobalVariableProvider from "../hooks/useGlobalVariabels";
import CatProvider from "@/hooks/useCategory";
import FakePurchaseNotifications from "@/components/atom/FakePurchaseNotifications";
import Script from "next/script";
import ClientFacebookWrapper from "@/components/facebook-pixle/ClientFacebookWrapper";
import { SessionProvider } from "next-auth/react";
import { Providers } from "./providers";
import AdvancedWhatsAppButton from "@/components/atom/AdvancedWhatsAppButton";
import MobileHeader from "@/components/molecules/MobileHeader";
import DesktopHeader from "@/components/organism/DesktopHeader";
import { CurrencyProvider } from "@/context/CurrencyContext";

const inter = Inter({
    subsets: ["latin"],
    display: 'swap', // Prevents invisible text during font loading
});

export const metadata = {
    title: {
        default:
            "Shop Women's Suits, Winter Jackets & Shoes | Ibnemukhtar Brand Store Pakistan",
        template: "%s | Ibnemukhtar Brand Store",
    },
    description:
        "Discover premium quality sports uniforms and martial arts equipment designed for performance, durability, and style. Whether you're a beginner or a professional athlete, we bring you a wide range of gear that empowers your training and boosts your confidence.",
    keywords:
        "women's suits, winter jackets, shoes, affordable fashion, pre-loved clothing, formal suits, casual wear",
    authors: [{ name: "Ibnemukhtar Brand Store" }],
    creator: "Ibnemukhtar Brand Store",
    publisher: "Ibnemukhtar Brand Store",
    metadataBase: new URL("https://ibnemukhtarbrandstore.vercel.app/"), // Replace with your actual domain
    openGraph: {
        title: "Shop Women's Suits, Winter Jackets & Shoes | Ibnemukhtar Brand Store",
        description:
            "Discover premium quality sports uniforms and martial arts equipment designed for performance, durability, and style.",
        url: "https://ibnemukhtarbrandstore.vercel.app/", // Replace with your actual domain
        siteName: "Ibnemukhtar Brand Store",
        images: [
            {
                url: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766686449/download_r6qimr.jpg", // Add your OG image
                width: 800,
                height: 800,
                alt: "Ibnemukhtar Brand Store - Premium pre loved shoes",
            },
            {
                url: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766686480/Frosty_Family_Fun_x21s1g.jpg",
                width: 1200,
                height: 630,
                alt: "Ibnemukhtar Brand Store - Premium pre loved jackets",
            },
            {
                url: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766728166/LYL___Wecools_We_Choose_%E5%86%AC%E6%96%B0%E4%BD%9C%E7%B6%9A%E3%80%85%E5%85%A5%E8%8D%B7%E4%B8%AD_aojvpw.jpg",
                width: 1200,
                height: 630,
                alt: "Ibnemukhtar Brand Store - Premium pre loved suits",
            },
            {
                url: "https://res.cloudinary.com/dwqchugmp/image/upload/v1766686480/Frosty_Family_Fun_x21s1g.jpg", // Add your OG image
                width: 1200,
                height: 630,
                alt: "Ibnemukhtar Brand Store - Premium pre loved jackets",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Shop Women's Suits, Winter Jackets & Shoes | Ibnemukhtar Brand Store",
        description:
            "Discover premium quality preloved sports & fashion wears.",
        images: [
            "https://res.cloudinary.com/dwqchugmp/image/upload/v1766686480/Frosty_Family_Fun_x21s1g.jpg",
            "https://res.cloudinary.com/dwqchugmp/image/upload/v1766728166/LYL___Wecools_We_Choose_%E5%86%AC%E6%96%B0%E4%BD%9C%E7%B6%9A%E3%80%85%E5%85%A5%E8%8D%B7%E4%B8%AD_aojvpw.jpg",
            "https://res.cloudinary.com/dwqchugmp/image/upload/v1766686480/Frosty_Family_Fun_x21s1g.jpg",
        ], // Add your Twitter image
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    icons: {
        icon: "/images/ibnemukhtar-logo.png",
        shortcut: "/images/ibnemukhtar-logo.png",
        apple: "/images/ibnemukhtar-logo.png",
    },
    alternates: {
        canonical: "https://ibnemukhtarbrandstore.vercel.app/",
    },
    verification: {
        google: "qCNmybA9NO4SfownCTp8dkYsHTx0XOvdRk0Kr7PmOBs",
    },
};

export default function RootLayout({ children }) {
    const jsonLdOrg = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Ibnemukhtar Brand Store",
        "url": "https://ibnemukhtarbrandstore.vercel.app/",
        "logo": "https://ibnemukhtarbrandstore.vercel.app/images/ibnemukhtar-logo.png",
        "description": "Shop women's suits, winter jackets, shoes and sports apparel in Pakistan.",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+92-316-4288921",
            "contactType": "customer service",
            "areaServed": "PK"
        }
    };

    const jsonLdWebSite = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Ibnemukhtar Brand Store",
        "url": "https://ibnemukhtarbrandstore.vercel.app/",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://ibnemukhtarbrandstore.vercel.app/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <html lang="en">
            <head>
                {/* Performance: Resource hints for external domains */}
                <link rel="preconnect" href="https://res.cloudinary.com" />
                <link rel="dns-prefetch" href="https://www.facebook.com" />
                <link rel="dns-prefetch" href="https://vercel.com" />

                {/* Meta tags */}
                <meta name="theme-color" content="#ffffff" />
                <meta
                    name="facebook-domain-verification"
                    content="nacpytod5s5ffuq77lmy9ws820jyiz"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
                <meta name="google-site-verification" content="u9Ht-tpTj9hZeTHgbLt5ztmOsfEjVTZy76_XM-h51nE" />

                {/* Sitewide Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
                />
            </head>
            <body className={inter.className}>
                <Providers>
                    <AuthProvider>
                        <CatProvider>
                            <GlobalVariableProvider>
                                <CurrencyProvider>
                                    <CartProvider>
                                        <TopLoaderProvider />
                                        <MobileHeader />
                                        <DesktopHeader />
                                        <ToastContainer
                                            position="top-center"
                                            autoClose={4000}
                                            hideProgressBar={false}
                                            newestOnTop={false}
                                            closeOnClick={true}
                                            rtl={false}
                                            pauseOnFocusLoss
                                            draggable
                                            pauseOnHover
                                            theme="light"
                                        />
                                        <FakePurchaseNotifications />
                                        <SpeedInsights />
                                        <Analytics />
                                        <ClientFacebookWrapper />
                                        {children}
                                        {/* <AdvancedWhatsAppButton /> */}
                                        <Foter />
                                        <MobileFooter />
                                    </CartProvider>
                                </CurrencyProvider>
                            </GlobalVariableProvider>
                        </CatProvider>
                    </AuthProvider>
                </Providers>
            </body>
        </html>
    );
}