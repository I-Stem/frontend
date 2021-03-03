import React, { useEffect, useRef, useState } from "react";
import "./styles.scss";
import { IHeader } from "./Header";
import Link from "next/link";
import { Drawer, IconButton, Hidden } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { DASHBOARD_ROUTE } from "@Definitions/Constants";
import { Button, Card, Overlay, Row } from "react-bootstrap";
import { ThemeButton } from "@Components/Theme/ThemeButton";
import { IStore, Themes } from "@Interfaces";
import { connect } from "react-redux";
import { AuthActions } from "@Actions";

const staticPath = "/static/images";
const Header: React.FunctionComponent<IHeader.IProps> = props => {
  const { children, user } = props;
  const [show, setShow] = useState(false);
  const target = useRef(null);
  const [themes, setThemes] = useState<Themes>();
  useEffect(() => {
    updateTheme();
  }, [themes]);
  const updateTheme = () => {
    props.updatePreferences({
      user: {
        ...user,
        userPreferences: {
          ...user.userPreferences,
          themes: {
            ...themes,
          },
        },
      },
    });
  };
  const handleFontChange = (font: string) => {
    setThemes({ ...themes, fontTheme: font });
  };
  const handleThemeChange = (theme: string) => {
    setThemes({ ...themes, colorTheme: theme });
  };
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
      <>
        <Button
          className="theme-button hide-border"
          ref={target}
          onClick={() => setShow(!show)}
        >
          Accessibility Settings
        </Button>
        <Overlay target={target.current} show={show} placement="bottom">
          {({ placement, arrowProps, show: _show, popper, ...props }) => (
            <div
              {...props}
              className="theme-overlay"
              style={{
                color: "white",
                borderRadius: 4,
                ...props.style,
              }}
            >
              <Card className="theme-card">
                <Card.Body>
                  <h2>Font size</h2>
                  <Row>
                    <Button
                      onClick={() => handleFontChange("fontM")}
                      className="theme-button"
                    >
                      A
                    </Button>
                    <Button
                      onClick={() => handleFontChange("fontL")}
                      className="theme-button"
                    >
                      A+
                    </Button>
                    <Button
                      onClick={() => handleFontChange("fontXL")}
                      className="theme-button"
                    >
                      A++
                    </Button>
                  </Row>
                </Card.Body>

                <Card.Body>
                  <h2>Themes</h2>
                  <div
                    role="group"
                    onChange={() => handleThemeChange("blackWhite")}
                  >
                    <ThemeButton
                      topBackground="#178B8B"
                      bottomBackground="white"
                      onThemeChange={handleThemeChange}
                      theme="greenWhite"
                    />
                    <ThemeButton
                      topBackground="#8E0300"
                      bottomBackground="white"
                      onThemeChange={handleThemeChange}
                      theme="redWhite"
                    />
                    <ThemeButton
                      topBackground="black"
                      bottomBackground="white"
                      onThemeChange={handleThemeChange}
                      theme="blakWhite"
                    />
                    <ThemeButton
                      topBackground="#FFFF01"
                      bottomBackground="black"
                      onThemeChange={handleThemeChange}
                      theme="yellowBlack"
                    />
                    <ThemeButton
                      topBackground="#FFFF01"
                      bottomBackground="#0707EE"
                      onThemeChange={handleThemeChange}
                      theme="yellowBlue"
                    />
                    <ThemeButton
                      topBackground="white"
                      bottomBackground="black"
                      onThemeChange={handleThemeChange}
                      theme="whiteBlack"
                    />
                  </div>
                </Card.Body>
                <Button className="reset-all">Reset All</Button>
              </Card>
            </div>
          )}
        </Overlay>
      </>
      {children}
    </div>
  );
};

const mapStateToProps = (store: IStore) => {
  const { auth } = store;
  return {
    user: auth.user,
  };
};
const mapDispatchToProps = {
  updatePreferences: AuthActions.updateCardPreferences,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
