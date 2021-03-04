import React, { useEffect, useRef, useState } from "react";
import "./styles.scss";
import { IHeader } from "./Header";
import Link from "next/link";
import { IconButton, Hidden } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { DASHBOARD_ROUTE } from "@Definitions/Constants";
import ThemeButton from "@Components/Theme/ThemeButton";

const staticPath = "/static/images";
const Header: React.FunctionComponent<IHeader.IProps> = props => {
  const { children } = props;

  return (
    <div className="lip-header p-4  w-full flex justify-between">
      <Hidden mdUp implementation="css">
        <IconButton
          style={{ color: "#FFFFFF" }}
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={() => props.toggleDrawer()}
        >
          <MenuIcon />
        </IconButton>
      </Hidden>
      <Link href={DASHBOARD_ROUTE}>
        <img className="lip-logo" src={`${staticPath}/logo.svg`} alt="Logo" />
      </Link>
      <ThemeButton />
      {children}
    </div>
  );
};

export default Header;
