import React, { Fragment, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { Drawer, IconButton, Hidden } from "@material-ui/core";
import { Breadcrumb, Button, Col, Row } from "antd";
import "./style.scss";
import UserDropDown from "@Components/StemServices/UserDropDown";
import Header from "@Components/Basic/Header";
import { BREADCRUMB_MAP, MENU_ITEMS } from "@Definitions/Constants";
import { DashboardProps } from "./DashboardProps";

const DashboardLayout: React.FunctionComponent<DashboardProps> = (
  { children, hideBreadcrumb },
  props: any
): JSX.Element => {
  const initialFocus = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { window } = props;
  const menuItems = MENU_ITEMS;
  const { pathname } = router;
  const pathSnippets = pathname.substring(1).split("/");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const container =
    window !== undefined ? () => window().document.body : undefined;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  if (mobileOpen) {
    document.body.style.overflow = "hidden";
    initialFocus.current?.focus();
  } else {
    document.body.style.overflow = "auto";
  }
  const navigation = (
    <nav className="h-full w-full ant-menu ant-menu-light ant-menu-root ant-menu-inline">
      {menuItems.map(item => {
        return (
          <Link href={item.link} key={item.link}>
            <a className="ant-menu-item ant-menu-item-only-child text-base font-semibold menu-font">
              {item.name}
            </a>
          </Link>
        );
      })}
    </nav>
  );
  const extraBreadcrumbItems = hideBreadcrumb
    ? []
    : pathSnippets.map(path => {
        const { url, title } = BREADCRUMB_MAP[path];
        return (
          <Breadcrumb.Item key={url}>
            <Link href={url}>
              <a>{title}</a>
            </Link>
          </Breadcrumb.Item>
        );
      });
  const breadcrumbItems = [<React.Fragment />].concat(extraBreadcrumbItems);
  return (
    <section className="lipbg">
      <Row>
        <Header toggleDrawer={handleDrawerToggle}>
          <UserDropDown />
        </Header>
      </Row>
      <Row justify="center" className="dashboard-container h-auto">
        <Hidden mdUp implementation="css">
          <div ref={initialFocus} tabIndex={-1}>
            <Drawer
              container={container}
              variant="persistent"
              anchor="left"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
            >
              {navigation}
            </Drawer>
          </div>
        </Hidden>
        <Col
          xs={0}
          lg={5}
          className="text-right border-2 pt-8 width-20p"
          key="1"
        >
          {navigation}
        </Col>
        <Col sm={24} lg={19} className="pl-8" key="2">
          <div className="pt-10">
            {hideBreadcrumb ? (
              <Fragment />
            ) : (
              <Breadcrumb>{breadcrumbItems}</Breadcrumb>
            )}
          </div>
          {children}
        </Col>
      </Row>
    </section>
  );
};

export { DashboardLayout };
