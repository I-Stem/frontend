import React, { Fragment, useRef } from "react";
import Head from "next/head";
import Cookie from "js-cookie";
import { useRouter } from "next/router";
import Link from "next/link";
import { Drawer, IconButton, Hidden } from "@material-ui/core";
// import {Link} from '@adobe/react-spectrum'
import { Breadcrumb, Button, Col, Row } from "antd";
import "./style.scss";
import UserDropDown from "@Components/StemServices/UserDropDown";
import Header from "@Components/Basic/Header";
import {
  BREADCRUMB_MAP,
  MENU_ITEMS,
  UserType,
  UserRole,
  ISTEM_ADMIN_MENU_ITEMS,
  ISTEM_REMEDIATOR_MENU_ITEMS,
  UNIVERSITY_STAFF_MENU_ITEMS,
  BUSINESS_STAFF_MENU_ITEMS,
} from "@Definitions/Constants";
import { DashboardProps } from "./DashboardProps";

function getMenuItemsByUserTypeAndRole(
  userType: UserType | undefined,
  role: string | undefined
) {
  switch (userType) {
    case UserType.I_STEM:
      if (role === UserRole.ADMIN) {
        return ISTEM_ADMIN_MENU_ITEMS;
      } else if (role === UserRole.REMEDIATOR) {
        return ISTEM_REMEDIATOR_MENU_ITEMS;
      }
      break;

    case UserType.UNIVERSITY:
      if (role === UserRole.STAFF) {
        return UNIVERSITY_STAFF_MENU_ITEMS;
      }
      break;

    case UserType.BUSINESS:
      if (role === UserRole.STAFF) {
        return BUSINESS_STAFF_MENU_ITEMS;
      }
      break;

    default:
      return [];
  }

  return [];
}

const DashboardLayout: React.FunctionComponent<DashboardProps> = (
  { children, hideBreadcrumb, role, userType, escalationSetting },
  props: any
): JSX.Element => {
  const initialFocus = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { window } = props;
  const menuItems = MENU_ITEMS;
  const additionalMenuItems = getMenuItemsByUserTypeAndRole(userType, role);
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
  const universityNav = additionalMenuItems.map((item: any) => {
    return (
      <Link href={item.link} key={item.link}>
        <a className="ant-menu-item ant-menu-item-only-child text-base font-semibold menu-font">
          {item.name}
        </a>
      </Link>
    );
  });
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
      {additionalMenuItems.length > 0 ? (
        <div>
          <div className="navbar-divider"></div>
          <div className="text-base font-semibold manage-options">
            MANAGE OPTIONS
          </div>
          {universityNav}
        </div>
      ) : (
        <></>
      )}
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
