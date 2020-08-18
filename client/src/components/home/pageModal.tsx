/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { AlertOutlined, EditTwoTone, SettingTwoTone } from "@ant-design/icons";
import { v4 } from "uuid";
import { Modal, Select, Input, Menu, Dropdown, Form } from "antd";
const { Item } = Form;

interface IDefaultProps {
  modalContent: any;
  selectedTask: any;
  loggedUser: any;
  filters: any;
  selectedProject: any;
  selectedUser: any;
  users: Array<any>;
  roles: Array<any>;
  subModalContent: any;
  handleOk: Function;
  handleSubOk: Function;
  handleCancel: Function;
  handleSubCancel: Function;
  handleModalContentState: Function;
  handleSubModalContentState: Function;
  handleSelectedUser: Function;
  handleSubModalContent: Function;
  handleFilterState: Function;
  handleSearchUsers: Function;
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const PageModal = (props: IDefaultProps) => {
  const {
    modalContent,
    selectedProject,
    selectedTask,
    selectedUser,
    users,
    loggedUser,
    roles,
    filters,
    handleOk,
    handleSubOk,
    handleCancel,
    handleSubCancel,
    subModalContent,
    handleModalContentState,
    handleSubModalContentState,
    handleSelectedUser,
    handleSubModalContent,
    handleFilterState,
    handleSearchUsers,
  } = props;

  const userSettings = (
    <Menu className="users-settings">
      <Menu.Item key="0">
        <span
          className="edit-item"
          onClick={(e) => {
            e.stopPropagation();
            handleSubModalContent({
              modalTitle: `Change role for "${selectedUser.firstName} ${selectedUser.secondName}"`,
              modalMode: "EditUser",
              modalVisible: true,
              taskTitle: selectedTask.title,
              taskDescription: selectedTask.description,
            });
          }}
        >
          <EditTwoTone />
          Change role
        </span>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Modal
        className={`home-modal ${
          modalContent.modalMode === "UsersList" && "users-list"
        }`}
        title={modalContent.modalTitle}
        visible={modalContent.modalVisible}
        onOk={() => handleOk()}
        onCancel={() => handleCancel()}
      >
        {modalContent.modalMode === "CreateTask" ? (
          <div className="create-task-container">
            <div className="data-unit">
              <h4>Title</h4>
              <Input
                value={modalContent.taskTitle}
                placeholder="New task title"
                onChange={(e) =>
                  handleModalContentState("taskTitle", e.target.value)
                }
              />
            </div>
            <div className="data-unit">
              <h4>Description</h4>
              <Input.TextArea
                value={modalContent.taskDescription}
                rows={6}
                placeholder="New task description"
                onChange={(e) =>
                  handleModalContentState("taskDescription", e.target.value)
                }
              />
            </div>
          </div>
        ) : modalContent.modalMode === "EditTask" ? (
          <div className="edit-task-container">
            <div className="data-unit">
              <div className="data-sub-unit">
                <h4>Title</h4>
                <Input
                  className="task-title-input"
                  value={modalContent.taskTitle}
                  placeholder="Task title"
                  onChange={(e) =>
                    handleModalContentState("taskTitle", e.target.value)
                  }
                />
              </div>

              <div className="data-sub-unit">
                <h4>Developer</h4>
                <Select
                  className="task-developer-select"
                  defaultValue={
                    modalContent.taskDeveloper || selectedTask.developerId
                  }
                  onChange={(value) =>
                    handleModalContentState("taskDeveloper", value)
                  }
                >
                  <Select.Option value={0}>---</Select.Option>
                  {users
                    .filter((user) => user.role === "Developer")
                    .map((user) => (
                      <Select.Option value={user.id}>
                        {user.firstName} {user.secondName} ({user.role})
                      </Select.Option>
                    ))}
                </Select>
              </div>
            </div>
            <div className="data-unit">
              <h4>Description</h4>
              <Input.TextArea
                value={modalContent.taskDescription}
                rows={6}
                placeholder="Task description"
                onChange={(e) =>
                  handleModalContentState("taskDescription", e.target.value)
                }
              />
            </div>
          </div>
        ) : modalContent.modalMode === "DeleteTask" ? (
          <div className="delete-task-container">
            <div className="data-unit">
              <AlertOutlined />
              <h4>
                Are you sure about deleting this task? It will completely remove
                all it`s data.
              </h4>
            </div>
          </div>
        ) : modalContent.modalMode === "CreateProject" ? (
          <div className="create-project-container">
            <div className="data-unit">
              <div className="data-sub-unit">
                <h4>Title</h4>
                <Input
                  className="task-title-input"
                  value={modalContent.projectTitle}
                  placeholder="New project title"
                  onChange={(e) =>
                    handleModalContentState("projectTitle", e.target.value)
                  }
                />
              </div>

              <div className="data-sub-unit">
                <h4>Code</h4>
                <Input
                  className="task-title-input"
                  value={modalContent.projectCode}
                  placeholder="New project code"
                  onChange={(e) =>
                    handleModalContentState("projectCode", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="data-unit">
              <h4>Description</h4>
              <Input.TextArea
                value={modalContent.projectDescription}
                rows={6}
                placeholder="New project description"
                onChange={(e) =>
                  handleModalContentState("projectDescription", e.target.value)
                }
              />
            </div>
          </div>
        ) : modalContent.modalMode === "UpdateProject" ? (
          <div className="update-project-container">
            <div className="data-unit">
              <div className="data-sub-unit">
                <h4>Title</h4>
                <Input
                  className="task-title-input"
                  value={modalContent.projectTitle}
                  placeholder="New project title"
                  onChange={(e) =>
                    handleModalContentState("projectTitle", e.target.value)
                  }
                />
              </div>

              <div className="data-sub-unit">
                <h4>Code</h4>
                <Input
                  className="task-title-input"
                  value={modalContent.projectCode}
                  placeholder="New project code"
                  onChange={(e) =>
                    handleModalContentState("projectCode", e.target.value)
                  }
                />
              </div>
            </div>

            {
              loggedUser.role === 'Admin' ? (
                <div className="data-unit">
                  <h4>Manager</h4>
                  <Select
                    className="project-manager-select"
                    defaultValue={
                      modalContent.projectManager || selectedProject.managerId
                    }
                    onChange={(value) =>
                      handleModalContentState("projectManager", value)
                    }
                  >
                    <Select.Option value={0}>---</Select.Option>
                    {users
                      .filter((user) => user.role === "Manager")
                      .map((user) => (
                        <Select.Option value={user.id}>
                          {user.firstName} {user.secondName} ({user.role})
                        </Select.Option>
                      ))}
                  </Select>
                </div>
              ) : (<></>)
            }

            <div className="data-unit">
              <h4>Description</h4>
              <Input.TextArea
                value={modalContent.projectDescription}
                rows={6}
                placeholder="New project description"
                onChange={(e) =>
                  handleModalContentState("projectDescription", e.target.value)
                }
              />
            </div>
          </div>
        ) : modalContent.modalMode === "DeleteProject" ? (
          <div className="delete-task-container">
            <div className="data-unit">
              <AlertOutlined />
              <h4>
                Are you sure about deleting this project? It will completely
                remove all it's data and tasks, related to it.
              </h4>
            </div>
          </div>
        ) : modalContent.modalMode === "UsersList" ? (
          <div className="users">
            <div className="user-list-head">
              <Input.Search
                placeholder="Search"
                value={filters.userFilter}
                allowClear
                onChange={(e) => {
                  handleFilterState("userFilter", e.target.value);
                }}
                onSearch={() => handleSearchUsers()}
              />
            </div>
            <div className="users-list-container">
              <div className="users-list">
                {users
                  .filter((user) => user.id !== loggedUser.id)
                  .map((user: any) => (
                    <div
                      className={`user-list-item ${
                        selectedUser.id === user.id
                          ? "selected"
                          : "not-selected"
                      }`}
                      key={v4()}
                      onClick={() => handleSelectedUser(user)}
                    >
                      <div className="item-head">
                        <div className="head-text">
                          {user.firstName.substr(0, 1).toUpperCase()}
                          {user.secondName.substr(0, 1).toUpperCase()}
                        </div>
                      </div>
                      <div className="item-main-content">
                        <div className="user-data">
                          <span className="user-info">
                            <strong>Username:</strong> {user.username}
                          </span>
                          <span className="user-info">
                            <strong>Name:</strong> {user.firstName}{" "}
                            {user.secondName}
                          </span>
                          <span className="user-info">
                            <strong>Role:</strong> {user.role}
                          </span>
                        </div>
                        <div className="edit-user-icon">
                          {selectedUser.id === user.id && (
                            <Dropdown
                              overlay={userSettings}
                              trigger={["click"]}
                              placement="bottomRight"
                            >
                              <a
                                className="ant-dropdown-link"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <SettingTwoTone />
                              </a>
                            </Dropdown>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : modalContent.modalMode === "ResetPassword" ? (
          <Form {...layout}>
            <Item
              label="New password"
              name="password1"
              rules={[
                { required: true, message: "Please input your new password!" },
                { min: 8, message: "Minimal length of password: 8." },
                { max: 14, message: "Maximum length of password: 14." },
                {
                  pattern: /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
                  message:
                    "Password must container at least one uppercase letter and number!",
                },
              ]}
            >
              <Input.Password
                value={modalContent.password1}
                onChange={(e) =>
                  handleModalContentState("password1", e.target.value)
                }
              />
            </Item>
            <Item
              label="Confirm password"
              name="password2"
              rules={[
                { required: true, message: "Please input your new password!" },
                { min: 8, message: "Minimal length of password: 8." },
                { max: 14, message: "Maximum length of password: 14." },
                {
                  pattern: new RegExp(`${modalContent.password1}`, "g"),
                  message: "Passwords should be equal!",
                },
              ]}
            >
              <Input.Password
                value={modalContent.password2}
                onChange={(e) =>
                  handleModalContentState("password2", e.target.value)
                }
              />
            </Item>
          </Form>
        ) : (
          <div></div>
        )}
      </Modal>

      <Modal
        visible={subModalContent.modalVisible}
        title={subModalContent.modalTitle}
        className="sub-modal-container"
        onOk={() => handleSubOk()}
        onCancel={() => handleSubCancel()}
      >
        {subModalContent.modalMode === "EditUser" ? (
          <div className="user-edit-container">
            <div className="data-unit">
              <h4>Role:</h4>
              <Select
                className="user-role-select"
                defaultValue={
                  subModalContent.userRole ||
                  roles.find((role) => role.name === selectedUser.role).id
                }
                onChange={(value) =>
                  handleSubModalContentState("userRole", value)
                }
              >
                {roles.map((role) => (
                  <Select.Option value={role.id} key={v4()}>
                    {role.name}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </Modal>
    </>
  );
};

export default PageModal;
