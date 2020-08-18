import React from "react";
import { connect } from "react-redux";

import {
  getProjectsAction,
  createProjectsAction,
  updateProjectAction,
  deleteProjectAction,
} from "../store/actions/projects";
import { logoutAction } from "../store/actions/login";
import {
  getUsersAction,
  getUsersRolesAction,
  updateUserRoleAction,
  resetPasswordRequest,
} from "../store/actions/users";
import {
  getTasksAction,
  createTaskAction,
  updateTaskAction,
  updateTaskStatusAction,
  deleteTaskAction,
} from "../store/actions/tasks";
import { serverConnectionAction } from "../store/actions/socket";

import PageHeader from "../components/home/header";
import PageContent from "../components/home/pageContent";
import PageModal from "../components/home/pageModal";
import { withRouter, RouteComponentProps } from "react-router";

interface IDefaultProps extends RouteComponentProps<any> {
  loggedUser: any;
  tasks: Array<any>;
  users: Array<any>;
  roles: Array<any>;
  projects: Array<any>;
  taskPages: number;
  totalTaskCount: number;
  serverConnectionAction: Function;
  updateTaskStatusAction: Function;
  updateUserRoleAction: Function;
  resetPasswordRequest: Function;
  createProjectsAction: Function;
  updateProjectAction: Function;
  deleteProjectAction: Function;
  getUsersRolesAction: Function;
  getProjectsAction: Function;
  createTaskAction: Function;
  updateTaskAction: Function;
  deleteTaskAction: Function;
  getUsersAction: Function;
  getTasksAction: Function;
  logoutAction: Function;
}

interface IDefaultState {
  selectedProject: any;
  selectedTask: any;
  selectedUser: any;
  isUserRestricted: boolean;
  modalContent: {
    modalVisible: boolean;
    modalTitle: string;
    modalMode: string;
    taskTitle?: string;
    taskDescription?: string;
    taskDeveloper?: number;
    projectTitle?: string;
    projectDescription?: string;
    projectCode?: string;
    projectManager?: number;
    password1?: string;
    password2?: string;
  };
  subModalContent: {
    modalVisible: boolean;
    modalTitle: string;
    modalMode: string;
    userRole?: number;
  };
  filters: {
    projectFilter: string;
    taskFilter: string;
    userFilter: string;
  };
  pages: {
    projectPage: number;
    taskPage: number;
    userPage: number;
  };
}

class HomePage extends React.Component<IDefaultProps, IDefaultState> {
  constructor(props: any) {
    super(props);

    this.state = {
      selectedProject: {},
      selectedTask: {},
      selectedUser: {},
      isUserRestricted: false,
      modalContent: {
        modalVisible: false,
        modalTitle: "",
        taskTitle: "",
        taskDescription: "",
        taskDeveloper: 0,
        projectTitle: "",
        projectDescription: "",
        projectCode: "",
        projectManager: 0,
        modalMode: "",
      },
      subModalContent: {
        modalVisible: false,
        modalTitle: "",
        modalMode: "",
        userRole: 0,
      },
      filters: {
        projectFilter: "",
        taskFilter: "",
        userFilter: "",
      },
      pages: {
        projectPage: 1,
        taskPage: 1,
        userPage: 1,
      },
    };
  }

  componentDidMount() {
    const { projectFilter } = this.state.filters;
    const { projectPage } = this.state.pages;

    document.title = "Projer | Home";
    if (this.props.loggedUser.role !== 'User') {
      this.props.serverConnectionAction();
      this.props.getUsersRolesAction();
      this.props.getProjectsAction({ filter: projectFilter, page: projectPage });
      this.props.getUsersAction({ filter: '', page: 1 });
    } else {
      this.setState({isUserRestricted: true});
    }
  }

  handleSelectedProject = (project: any) => {
    this.setState(
      (prevState) => {
        if (prevState.selectedProject.id === project.id) {
          return {
            ...prevState,
            selectedProject: {},
            filters: { ...prevState.filters, taskFilter: "" },
            pages: { ...prevState.pages, taskPage: 1 },
          };
        }
        return {
          ...prevState,
          selectedProject: project,
          filters: { ...prevState.filters, taskFilter: "" },
          pages: { ...prevState.pages, taskPage: 1 },
        };
      },
      () => {
        this.props.getTasksAction({
          projectId: project.id,
          filter: "",
          page: 1,
        });
      }
    );
  };

  handleSelectedTask = (task: any) => {
    this.setState((prevState) => {
      if (prevState.selectedTask.id === task.id) {
        return { selectedTask: {} };
      }
      return {
        selectedTask: task,
      };
    });
  };

  handleSelectedUser = (user: any) => {
    this.setState((prevState) => {
      if (prevState.selectedUser.id === user.id) {
        return { selectedUser: {} };
      }
      return {
        selectedUser: user,
      };
    });
  };

  handleModalContent = (data: {
    modalVisible: boolean;
    modalTitle: string;
    modalMode: string;
    taskTitle?: string;
    taskDescription?: string;
    projectTitle?: string;
    projectDescription?: string;
    projectCode?: string;
    projectManager?: number;
  }) => {
    this.setState({ modalContent: data });
  };

  handleSubModalContent = (data: {
    modalVisible: boolean;
    modalTitle: string;
    modalMode: string;
    userRole?: number;
  }) => {
    this.setState({ subModalContent: data });
  };

  // MODAL CONTENT STATE HANDLERS

  handleModalContentState = (field: string, value: string | number) => {
    this.setState({
      modalContent: {
        ...this.state.modalContent,
        [field]: value,
      },
    });
  };

  // SUB MODAL CONTENT STATE HANDLER

  handleSubModalContentState = (field: string, value: string) => {
    this.setState({
      subModalContent: { ...this.state.subModalContent, [field]: value },
    });
  };

  // SEARCH INPUTS HANDLER

  handleFilterState = (field: string, value: string) => {
    this.setState(
      {
        filters: {
          ...this.state.filters,
          [field]: value,
        },
      },
      () => {
        if (!value) {
          switch (field) {
            case "projectFilter":
              this.handleSearchProjects();
              break;
            case "taskFilter":
              this.handleSearchTasks();
              break;
            case "userFilter":
              this.handleSearchUsers();
              break;
          }
        }
      }
    );
  };

  handleSearchProjects = () => {
    this.handlePageState("projectPage", 1);
    this.props.getProjectsAction({
      filter: this.state.filters.projectFilter,
      page: 1,
    });
  };

  handleSearchTasks = () => {
    this.handlePageState("taskPage", 1);
    this.props.getTasksAction({
      filter: this.state.filters.taskFilter,
      page: 1,
    });
  };

  handleSearchUsers = () => {
    this.handlePageState("userPage", 1);
    this.props.getUsersAction({
      filter: this.state.filters.userFilter,
      page: 1,
    });
  };

  // PAGINATION PAGE HANDLER

  handlePageState = (field: string, value: number) => {
    this.setState(
      {
        pages: {
          ...this.state.pages,
          [field]: value,
        },
      },
      () => {
        switch (field) {
          case "projectPage":
            this.props.getProjectsAction({
              filter: this.state.filters.projectFilter,
              page: this.state.pages.projectPage,
            });
            break;
          case "taskPage":
            this.props.getTasksAction({
              filter: this.state.filters.taskFilter,
              projectId: this.state.selectedProject.id,
              page: this.state.pages.taskPage,
            });
            break;
        }
      }
    );
  };

  clearModalContent = () => {
    this.setState({
      modalContent: {
        modalVisible: false,
        modalTitle: "",
        taskTitle: "",
        taskDescription: "",
        taskDeveloper: 0,
        projectTitle: "",
        projectDescription: "",
        projectCode: "",
        projectManager: 0,
        modalMode: "",
      },
    });
  };

  clearSubModalContent = () => {
    this.setState({
      subModalContent: {
        modalVisible: false,
        modalTitle: "",
        userRole: 0,
        modalMode: "",
      },
    });
  };

  handleOk = () => {
    const { modalContent, selectedProject, selectedTask } = this.state;

    switch (modalContent.modalMode) {
      case "CreateTask":
        this.props.createTaskAction({
          title: modalContent.taskTitle,
          description: modalContent.taskDescription,
          projectId: selectedProject.id,
        });
        this.clearModalContent();
        break;
      case "EditTask":
        this.props.updateTaskAction({
          id: selectedTask.id,
          title: modalContent.taskTitle,
          description: modalContent.taskDescription,
          developerId: modalContent.taskDeveloper,
        });
        this.clearModalContent();
        break;
      case "DeleteTask":
        this.props.deleteTaskAction({
          id: selectedTask.id,
        });
        this.clearModalContent();
        break;
      case "CreateProject":
        this.props.createProjectsAction({
          title: modalContent.projectTitle,
          code: modalContent.projectCode,
          description: modalContent.projectDescription,
        });
        this.clearModalContent();
        break;
      case "UpdateProject":
        this.props.updateProjectAction({
          id: selectedProject.id,
          title: modalContent.projectTitle,
          managerId: modalContent.projectManager,
          description: modalContent.projectDescription,
          code: modalContent.projectCode,
        });
        this.clearModalContent();
        break;
      case "DeleteProject":
        this.props.deleteProjectAction({
          id: selectedProject.id,
        });
        this.clearModalContent();
        this.handleSelectedProject({});
        break;
      case "ResetPassword":
        if (!modalContent.password1 || !modalContent.password2) {
          alert("ERROR: Enter your new password!");
        } else if (modalContent.password1 !== modalContent.password2) {
          alert("ERROR: Passwords are not equal!");
        } else  {
          this.props.resetPasswordRequest({
            password: modalContent.password2,
          });
          this.clearModalContent();
        }
        break;
      case "UsersList":
        this.setState(
          {
            filters: {
              ...this.state.filters,
              userFilter: "",
            },
          },
          () => {
            this.handleSearchUsers();
            this.clearModalContent();
          }
        );
        break;
    }
  };

  handleCancel = () => {
    if (this.state.modalContent.modalMode === "UsersList") {
      this.setState(
        {
          filters: {
            ...this.state.filters,
            userFilter: "",
          },
        },
        () => {
          this.handleSearchUsers();
        }
      );
    }
    this.clearModalContent();
  };

  handleSubOk = () => {
    const { subModalContent, selectedUser } = this.state;
    switch (subModalContent.modalMode) {
      case "EditUser":
        this.props.updateUserRoleAction({
          id: selectedUser.id,
          roleId: subModalContent.userRole,
        });
        this.clearSubModalContent();
        break;
      default:
        break;
    }
  };

  handleSubCancel = () => {
    this.clearSubModalContent();
  };

  render() {
    const {
      projects,
      tasks,
      logoutAction,
      users,
      roles,
      loggedUser,
      updateTaskStatusAction,
      taskPages,
      totalTaskCount
    } = this.props;
    const {
      selectedProject,
      selectedTask,
      selectedUser,
      modalContent,
      subModalContent,
      pages,
      filters,
      isUserRestricted
    } = this.state;

    return (
      <div className="home">
        <PageHeader
          loggedUser={loggedUser}
          handleModalContent={this.handleModalContent}
          logoutAction={logoutAction}
        />

        <PageContent
          tasks={tasks}
          users={users}
          pages={pages}
          taskPages={taskPages}
          loggedUser={loggedUser}
          totalTaskCount={totalTaskCount}
          filters={filters}
          projects={projects}
          selectedTask={selectedTask}
          isUserRestricted={isUserRestricted}
          selectedProject={selectedProject}
          handleModalContent={this.handleModalContent}
          updateTaskStatusAction={updateTaskStatusAction}
          handleSelectedProject={this.handleSelectedProject}
          handleSelectedTask={this.handleSelectedTask}
          handleFilterState={this.handleFilterState}
          handlePageState={this.handlePageState}
          handleSearchProjects={this.handleSearchProjects}
          handleSearchTasks={this.handleSearchTasks}
        />

        <PageModal
          modalContent={modalContent}
          selectedProject={selectedProject}
          selectedTask={selectedTask}
          selectedUser={selectedUser}
          users={users}
          loggedUser={loggedUser}
          roles={roles}
          handleSubModalContent={this.handleSubModalContent}
          subModalContent={subModalContent}
          handleOk={this.handleOk}
          handleSubOk={this.handleSubOk}
          handleCancel={this.handleCancel}
          handleSubCancel={this.handleSubCancel}
          handleModalContentState={this.handleModalContentState}
          handleSubModalContentState={this.handleSubModalContentState}
          handleSelectedUser={this.handleSelectedUser}
          filters={filters}
          handleFilterState={this.handleFilterState}
          handleSearchUsers={this.handleSearchUsers}
        />
      </div>
    );
  }
}

const mapStateToProps = (store: any) => ({
  loggedUser: store.auth.user,
  projects: store.projects.projects,
  tasks: store.tasks.tasks,
  taskPages: store.tasks.pages,
  totalTaskCount: store.tasks.totalCount,
  users: store.users.users,
  roles: store.users.roles,
});

const mapDispatchToProps = {
  updateTaskStatusAction,
  getProjectsAction,
  createProjectsAction,
  updateUserRoleAction,
  updateProjectAction,
  deleteProjectAction,
  createTaskAction,
  updateTaskAction,
  deleteTaskAction,
  getTasksAction,
  getUsersAction,
  getUsersRolesAction,
  resetPasswordRequest,
  serverConnectionAction,
  logoutAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(HomePage));
