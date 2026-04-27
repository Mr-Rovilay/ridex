import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "@/lib/Provider";
import ReduxProvider from "@/redux/ReduxProvider";
import InitUser from "@/initUser";
import { Toaster } from "react-hot-toast";
import "leaflet/dist/leaflet.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RIDEX - Smart vehicle booking platform",
  description:
    " Ridex is a smart vehicle booking platform that connects users with nearby drivers for convenient and efficient transportation. With Ridex, you can easily book a ride, track your driver in real-time, and enjoy a seamless travel experience. Whether you need a quick ride to work or a comfortable trip to the airport, Ridex has got you covered. Join our community of riders and drivers today and experience the future of transportation with Ridex.",
  // icons: {
  //   icon: "/favicon.svg",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning // Add this
    >
      <body suppressHydrationWarning>
        {" "}
        {/* Add this */}
        <Provider>
          <ReduxProvider>
            <InitUser />
            <Toaster position="top-right" reverseOrder={false} />
            {children}
          </ReduxProvider>
        </Provider>
      </body>
    </html>
  );
}
