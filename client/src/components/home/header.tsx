import React from "react";
import { LogoutOutlined, EditTwoTone, MenuOutlined } from "@ant-design/icons";
import { Button, Menu, Dropdown } from "antd";

interface IDefaultProperties {
  loggedUser: any;
  logoutAction: Function;
  handleModalContent: Function;
}

function PageHeader(props: IDefaultProperties) {
  const { logoutAction, loggedUser, handleModalContent } = props;

  const headerMenu = (
    <Menu className="home">
      <Menu.Item
        key="0"
        onClick={() =>
          handleModalContent({
            modalVisible: true,
            modalTitle: "Reset password",
            modalMode: "ResetPassword",
          })
        }
      >
        <span className="edit-item">
          <EditTwoTone />
          Reset password
        </span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1" onClick={() => logoutAction()}>
        <span>
          <LogoutOutlined /> Logout
        </span>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="page-header">
      <div className="logo-container">
        <div className="logo">PJ</div>
        Projer
      </div>
      <div className="header-main-content">
        {loggedUser.role === "Admin" && (
          <Button
            className="open-users-button"
            onClick={() =>
              handleModalContent({
                modalVisible: true,
                modalTitle: "Users list",
                modalMode: "UsersList",
              })
            }
          >
            Open users list
          </Button>
        )}
        <Dropdown
          overlay={headerMenu}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button>
            <MenuOutlined />
          </Button>
        </Dropdown>
      </div>
    </div>
  );
}

export default PageHeader;
