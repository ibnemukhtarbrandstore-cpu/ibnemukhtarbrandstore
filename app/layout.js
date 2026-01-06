import MobileFooter from "@/components/organism/MobileFooter";
import { Analytics } from "@vercel/analytics/react";
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
import VoiceWidget, { PageVoiceGuide } from "./features/voice-ai";

const inter = Inter({ subsets: ["latin"] });

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
    verification: {
        google: "qCNmybA9NO4SfownCTp8dkYsHTx0XOvdRk0Kr7PmOBs",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <meta
                    name="facebook-domain-verification"
                    content="nacpytod5s5ffuq77lmy9ws820jyiz"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="google-site-verification" content="u9Ht-tpTj9hZeTHgbLt5ztmOsfEjVTZy76_XM-h51nE" />

                {/* Google Analytics */}

            </head>
            <body className={inter.className}>
                <Providers>
                    <AuthProvider>
                        <CatProvider>
                            <GlobalVariableProvider>
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
                                    <VoiceWidget />
                                    <PageVoiceGuide />
                                    <Foter />
                                    <MobileFooter />
                                </CartProvider>
                            </GlobalVariableProvider>
                        </CatProvider>
                    </AuthProvider>
                </Providers>
            </body>
        </html>
    );
}