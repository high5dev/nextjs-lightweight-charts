import Head from "next/head";
import Image from "next/image";
import localFont from "next/font/local";
import BettingChart from "./Charts";

export default function Home() {
  return (
    <>
      <Head>
        <title>BetMarketingHistory</title>
        <meta
          name="description"
          content="Generated for data visualization with lightweight charts"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-full">
          <BettingChart />
        </div>
      </div>
    </>
  );
}
