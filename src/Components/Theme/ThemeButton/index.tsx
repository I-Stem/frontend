import { IAuthUser, IStore, Themes } from "@Interfaces";
import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Overlay, Row } from "react-bootstrap";
import "./styles.scss";
// import { ColorThemes, FontThemes } from "@Definitions/Constants/ThemeConstants";
import { connect } from "react-redux";
import { AuthActions } from "@Actions";
import { ColorThemeButton } from "./ColorThemeButton";
import { ColorThemes, FontThemes } from "@Definitions/Constants/ThemeConstants";
import { UniversityPortal } from "@Services";
import { DownOutlined } from "@ant-design/icons";

const ThemeButton: React.FC<Props> = props => {
  const target = useRef(null);
  const [show, setShow] = useState(false);
  const [themes, setThemes] = useState<Themes>();
  const { children, user } = props;

  const handleFontChange = (font: FontThemes) => {
    setThemes({ ...themes, fontTheme: font });
    props.updatePreferences({
      user: {
        ...user,
        userPreferences: {
          ...user.userPreferences,
          themes: {
            ...themes,
            fontTheme: font,
          },
        },
      },
    });
    UniversityPortal.updateUserCardPreferences({
      ...user.userPreferences,
      themes: {
        ...themes,
        fontTheme: font,
      },
    });
  };
  const handleThemeChange = (theme: ColorThemes) => {
    setThemes({ ...themes, colorTheme: theme });
    props.updatePreferences({
      user: {
        ...user,
        userPreferences: {
          ...user.userPreferences,
          themes: {
            ...themes,
            colorTheme: theme,
          },
        },
      },
    });
    UniversityPortal.updateUserCardPreferences({
      ...user.userPreferences,
      themes: {
        ...themes,
        colorTheme: theme,
      },
    });
  };
  const handleReset = () => {
    setThemes({});
    props.updatePreferences({
      user: {
        ...user,
        userPreferences: {
          ...user.userPreferences,
          themes: {},
        },
      },
    });
    UniversityPortal.updateUserCardPreferences({
      ...user.userPreferences,
      themes: {},
    });
  };

  return (
    <>
      <Button
        className="theme-button hide-border"
        ref={target}
        onClick={() => setShow(!show)}
      >
        Accessibility Settings <DownOutlined style={{ verticalAlign: "0em" }} />
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
                    onClick={() => handleFontChange(FontThemes.FONTM)}
                    className="font-button"
                  >
                    A
                  </Button>
                  <Button
                    onClick={() => handleFontChange(FontThemes.FONTL)}
                    className="font-button"
                  >
                    A+
                  </Button>
                  <Button
                    onClick={() => handleFontChange(FontThemes.FONTXL)}
                    className="font-button"
                  >
                    A++
                  </Button>
                </Row>
              </Card.Body>

              <Card.Body>
                <h2>Themes</h2>
                <div role="group">
                  <ColorThemeButton
                    topBackground="#178B8B"
                    bottomBackground="white"
                    onThemeChange={handleThemeChange}
                    theme={ColorThemes.GREENWHITE}
                  />
                  <ColorThemeButton
                    topBackground="#8E0300"
                    bottomBackground="white"
                    onThemeChange={handleThemeChange}
                    theme={ColorThemes.REDWHITE}
                  />
                  <ColorThemeButton
                    topBackground="black"
                    bottomBackground="white"
                    onThemeChange={handleThemeChange}
                    theme={ColorThemes.BLACKWHITE}
                  />
                  <ColorThemeButton
                    topBackground="#FFFF01"
                    bottomBackground="black"
                    onThemeChange={handleThemeChange}
                    theme={ColorThemes.YELLOWBLACK}
                  />
                  <ColorThemeButton
                    topBackground="#FFFF01"
                    bottomBackground="#0707EE"
                    onThemeChange={handleThemeChange}
                    theme={ColorThemes.YELLOWBLUE}
                  />
                  <ColorThemeButton
                    topBackground="white"
                    bottomBackground="black"
                    onThemeChange={handleThemeChange}
                    theme={ColorThemes.WHITEBLACK}
                  />
                </div>
              </Card.Body>
              <Button className="reset-all hide-border" onClick={handleReset}>
                Reset All
              </Button>
            </Card>
          </div>
        )}
      </Overlay>
    </>
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

export default connect(mapStateToProps, mapDispatchToProps)(ThemeButton);
interface Props {
  user: IAuthUser;
  updatePreferences: Function;
}
