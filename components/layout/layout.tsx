import React, { Fragment } from "react";
import MainHeader from "@/components/layout/main-header";

const Layout = (props: any) => {
  return (
    <Fragment>
      <MainHeader />
      <main className="bg-slate-800 text-slate-100">{props.children}</main>
    </Fragment>
  );
};

export default Layout;
