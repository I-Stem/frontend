import React from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { Dropdown, Menu } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { IStore } from "@Interfaces";
import { AuthActions } from "@Actions";
import { IAuth } from "@Components/auth/Auth";
import { LOGIN_PAGE_ROUTE } from "@Definitions/Constants/pageroutes";

const UserDropDown = (props: IAuth.IUserDropdownProps) => {
  const router = useRouter();
  const { user } = props;

  function handleLogout() {
    props.logout();
    router.push(LOGIN_PAGE_ROUTE);
  }
  return (
    <div role="button" className="navbar__Logout" onClick={handleLogout}>
      Logout
     </div>
  );
};
function mapStateToProps(store: IStore) {
  const { auth } = store;
  return {
    user: auth?.user,
    token: auth?.token,
  };
}

const mapDispatchToProps = {
  logout: AuthActions.Logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserDropDown);



/*
----DropDown code-----

const menu = (
    <Menu>
      <Menu.Item key="1">
        <a href="#">My Profile</a>
      </Menu.Item>

      <Menu.Item key="2">
        <a onClick={handleLogout}>Logout</a>
      </Menu.Item>
    </Menu>
  );


<Dropdown overlay={menu} className="text-white">
<a className="float-right">
        <UserOutlined className="pt-3 float-left ml-3" />
        <span className="float-left pt-2 ml-3">{user?.fullname}</span>
        <DownOutlined className="float-left ml-3 pt-4" />
      </a>
      </Dropdown>

*/