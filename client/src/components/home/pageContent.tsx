/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import {
  CaretDownOutlined,
  SettingTwoTone,
  EditTwoTone,
  DeleteOutlined,
} from "@ant-design/icons";
import SideBar from "./pageSidebar";
import { v4 as v4uuid } from "uuid";
import { Button, Menu, Dropdown, Input, Pagination } from "antd";
import { tasksPageSize } from "../../static";

const { Search } = Input;

interface IDefaultProps {
  tasks: Array<any>;
  users: Array<any>;
  pages: any;
  filters: any;
  projects: Array<any>;
  selectedTask: any;
  selectedProject: any;
  taskPages: number;
  totalTaskCount: number;
  isUserRestricted: boolean;
  loggedUser: any;
  handleModalContent: Function;
  handleSelectedTask: Function;
  handleSelectedProject: Function;
  updateTaskStatusAction: Function;
  handleFilterState: Function;
  handlePageState: Function;
  handleSearchProjects: Function;
  handleSearchTasks: Function;
}

function PageContent(props: IDefaultProps) {
  const {
    projects,
    tasks,
    users,
    pages,
    filters,
    taskPages,
    loggedUser,
    totalTaskCount,
    isUserRestricted,
    updateTaskStatusAction,
    handleSelectedProject,
    handleSelectedTask,
    handleModalContent,
    handleFilterState,
    handlePageState,
    selectedProject,
    selectedTask,
    handleSearchProjects,
    handleSearchTasks,
  } = props;

  const currentProject = projects.find(
    (project) => project.id === selectedProject.id
  );
  const currentManager =
    currentProject &&
    users.find((user) => user.id === currentProject.managerId);

  const tasksSettings = (
    <Menu className="home">
      <Menu.Item
        key="0"
        onClick={() =>
          handleModalContent({
            modalTitle: `Edit task "${selectedTask.codeName}"`,
            modalMode: "EditTask",
            modalVisible: true,
            taskTitle: selectedTask.title,
            taskDescription: selectedTask.description,
          })
        }
      >
        <span className="edit-item">
          <EditTwoTone />
          Edit
        </span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1">
        <span
          className="delete-item"
          onClick={() =>
            handleModalContent({
              modalTitle: `Delete  task "${selectedTask.codeName}"`,
              modalMode: "DeleteTask",
              modalVisible: true,
            })
          }
        >
          <DeleteOutlined />
          Delete
        </span>
      </Menu.Item>
    </Menu>
  );

  const projectSettings = (
    <Menu className="home">
      <Menu.Item
        key="0"
        onClick={() =>
          handleModalContent({
            modalTitle: `Edit project "${currentProject.title}"`,
            modalMode: "UpdateProject",
            modalVisible: true,
            projectTitle: currentProject.title,
            projectDescription: currentProject.description,
            projectCode: currentProject.code,
            projectManager: currentProject.managerId,
          })
        }
      >
        <span className="edit-item">
          <EditTwoTone />
          Edit
        </span>
      </Menu.Item>
      {
        loggedUser.role === "Admin" ? (
          <Menu.Item key="1">
            <span
              className="delete-item"
              onClick={() =>
                handleModalContent({
                  modalTitle: `Delete  project "${currentProject.title}"`,
                  modalMode: "DeleteProject",
                  modalVisible: true,
                })
              }
            >
              <DeleteOutlined />
              Delete
            </span>
          </Menu.Item>
        ) : (<></>)
      }
    </Menu>
  );

  const tasksStatuses = (
    <Menu className="task-statuses">
      <Menu.Item key="0">
        <div className="item-container" onClick={(e) => e.stopPropagation()}>
          <span
            className={`status-box open`}
            onClick={(e) => {
              e.stopPropagation();
              updateTaskStatusAction({ id: selectedTask.id, status: "OPEN" });
            }}
          >
            OPEN
          </span>
        </div>
      </Menu.Item>
      <Menu.Item key="1">
        <div className="item-container" onClick={(e) => e.stopPropagation()}>
          <span
            className={`status-box in_progress`}
            onClick={(e) => {
              e.stopPropagation();
              updateTaskStatusAction({
                id: selectedTask.id,
                status: "IN_PROGRESS",
              });
            }}
          >
            IN_PROGRESS
          </span>
        </div>
      </Menu.Item>
      <Menu.Item key="2">
        <div className="item-container" onClick={(e) => e.stopPropagation()}>
          <span
            className={`status-box testing`}
            onClick={(e) => {
              e.stopPropagation();
              updateTaskStatusAction({
                id: selectedTask.id,
                status: "TESTING",
              });
            }}
          >
            TESTING
          </span>
        </div>
      </Menu.Item>
      <Menu.Item key="3">
        <div className="item-container" onClick={(e) => e.stopPropagation()}>
          <span
            className={`status-box done`}
            onClick={(e) => {
              e.stopPropagation();
              updateTaskStatusAction({ id: selectedTask.id, status: "DONE" });
            }}
          >
            DONE
          </span>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="page-content">
      <SideBar
        projects={projects}
        loggedUser={loggedUser}
        currentPage={pages.projectPage}
        projectFilter={filters.projectFilter}
        handleSelectedProject={handleSelectedProject}
        handleModalContent={handleModalContent}
        selectedProject={selectedProject}
        handleFilterState={handleFilterState}
        handlePageState={handlePageState}
        handleSearchProjects={handleSearchProjects}
        isUserRestricted={isUserRestricted}
      />

      {currentProject && currentProject.id ? (
        <div className="main-content">
          <h2>Project data</h2>

          <div className="project-info">
            <div className="project-code">
              <div className="code-text">{currentProject.code}</div>
            </div>

            <div className="project-data">
              <div className="data-row">
                <span>
                  <strong>Title:</strong> {currentProject.title}
                </span>
                {
                  loggedUser.role !== 'Developer' ? (
                    <Dropdown
                      overlay={projectSettings}
                      trigger={["click"]}
                      placement="bottomRight"
                    >
                      <a
                        className="ant-dropdown-link"
                        onClick={(e) => e.preventDefault()}
                      >
                        <SettingTwoTone />
                      </a>
                    </Dropdown>
                  ) : (<></>)
                }
              </div>
              <span className="data-row">
                <strong>Descipriotn:</strong> {currentProject.description}
              </span>
              <span className="data-row">
                <strong>Manager:</strong>{" "}
                {currentManager
                  ? `${currentManager.firstName} ${currentManager.secondName}`
                  : "No manager"}
              </span>
            </div>
          </div>

          <div className="tasks-list-container">
            <div className="tasks-list-head">
              <h2>Tasks</h2>
              <div className="task-list-head-body">
                <Search
                  placeholder="Search"
                  value={filters.taskFilter}
                  allowClear
                  onChange={(e) => {
                    handleFilterState("taskFilter", e.target.value);
                  }}
                  onSearch={() => handleSearchTasks()}
                />
                {taskPages && taskPages > 1 ? (
                  <Pagination
                    simple
                    current={pages.taskPage}
                    total={totalTaskCount}
                    pageSize={tasksPageSize}
                    onChange={(value) => handlePageState("taskPage", value)}
                  />
                ) : (
                  <div></div>
                )}
                <Button
                  type="dashed"
                  className="add-task-btn"
                  onClick={() =>
                    handleModalContent({
                      modalTitle: `Create task for "${currentProject.title}" project`,
                      modalMode: "CreateTask",
                      modalVisible: true,
                    })
                  }
                >
                  Add task
                </Button>
              </div>
            </div>

            <div className="tasks-list">
              {tasks && tasks.length ? (
                tasks.map((task) => (
                  <div
                    key={v4uuid()}
                    className={`task-item ${
                      selectedTask.id === task.id ? "opened" : "closed"
                    }`}
                  >
                    <div
                      className="task-header"
                      onClick={() => handleSelectedTask(task)}
                    >
                      <div className="code-container">{task.codeName}</div>
                      <div className="task-data">
                        <span className="data-row">Title: {task.title}</span>
                        <span className="data-row">
                          Status:
                          {selectedTask.id === task.id ? (
                            <Dropdown
                              overlay={tasksStatuses}
                              trigger={["click"]}
                              placement="bottomRight"
                            >
                              <span
                                className={`status-box ${
                                  task.status && task.status.toLowerCase()
                                }`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {task.status}
                              </span>
                            </Dropdown>
                          ) : (
                            <span
                              className={`status-box ${
                                task.status && task.status.toLowerCase()
                              }`}
                            >
                              {task.status}
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="arrow">
                        <CaretDownOutlined />
                      </div>
                    </div>

                    {selectedTask.id === task.id && (
                      <div className="task-body">
                        <div className="task-head">
                          <div className="title-row">
                            <span>
                              <strong>Description:</strong>
                            </span>
                            <span>
                              <strong>Developer:</strong>{" "}
                              {task.developerId && users
                                ? `${
                                    users.find(
                                      (user) => user.id === task.developerId
                                    ).firstName
                                  } ${
                                    users.find(
                                      (user) => user.id === task.developerId
                                    ).secondName
                                  }`
                                : "---"}
                            </span>
                          </div>
                          <Dropdown
                            overlay={tasksSettings}
                            trigger={["click"]}
                            placement="bottomRight"
                          >
                            <a
                              className="ant-dropdown-link"
                              onClick={(e) => e.preventDefault()}
                            >
                              <SettingTwoTone />
                            </a>
                          </Dropdown>
                        </div>
                        <div className="task-description">
                          {task.description}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-tasks">No tasks</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={
            isUserRestricted
              ? "main-content restricted-container"
              : "main-content empty-container"
          }
        >
          {
            isUserRestricted
              ? "You are restricted to get any data. Ask Admin to recheck your role."
              : "Select any project"
          }
        </div>
      )}
    </div>
  );
}
export default PageContent;
