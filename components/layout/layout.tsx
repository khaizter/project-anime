import React, { Fragment, useEffect } from "react";
import MainHeader from "@/components/layout/main-header";

import { spaceGrotesk, rajdhani, majorMonoDisplay } from "@/lib/fonts";
import MainFooter from "@/components/layout/main-footer";

const Layout = (props: any) => {
  return (
    <div className={`${spaceGrotesk} ${rajdhani} ${majorMonoDisplay}`}>
      <MainHeader />
      <main className="font-rajdhani text-slate-100 bg-gradient-to-b from-jacaranda to-black">
        {props.children}
      </main>
      <MainFooter />
    </div>
  );
};

export default Layout;
