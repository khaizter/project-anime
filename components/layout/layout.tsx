import React, { useEffect } from "react";
import MainHeader from "@/components/layout/main-header";
import Head from "next/head";
import { spaceGrotesk, rajdhani, majorMonoDisplay } from "@/lib/fonts";
import MainFooter from "@/components/layout/main-footer";
import MobileMenu from "@/components/layout/mobile-menu";
import { Toaster } from "@/components/ui/toaster";

const Layout = (props: any) => {
  return (
    <div className={`relative ${spaceGrotesk} ${rajdhani} ${majorMonoDisplay}`}>
      <Head>
        <title>Project Anime</title>
      </Head>
      <MainHeader />
      <div className="w-screen overflow-hidden">
        <main className="font-rajdhani text-slate-100 bg-gradient-to-b from-jacaranda to-jacaranda min-h-[80vh]">
          {props.children}
        </main>
        <MainFooter />
        <Toaster />
      </div>
      <MobileMenu />
    </div>
  );
};

export default Layout;
