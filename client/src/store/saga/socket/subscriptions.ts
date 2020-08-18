import {
  createProjectsAction,
  updateProjectAction,
  deleteProjectAction,
} from "../../actions/projects";

import {
  createTaskAction,
  updateTaskAction,
  updateTaskStatusAction,
  deleteTaskAction
} from "../../actions/tasks";

import {
  uploadNewUser,
  updateUserRoleAction
} from '../../actions/users';

export default (emit: any) => [

  // CONNECTIVITY
  [
    "connect",
    () => {
      console.log("CONNECTED TO SERVER");
    },
  ],

  //  PROJECTS
  [
    "ProjectCreated",
    (data: any) => {
      emit(createProjectsAction({ newProject: data, isSimple: true }));
    },
  ],
  [
    "ProjectUpdated",
    (data: any) => {
      emit(updateProjectAction({ updatedProject: data, isSimple: true }));
    },
  ],
  [
    "ProjectDeleted",
    (data: any) => {
      emit(deleteProjectAction({ id: data.projectId, isSimple: true }));
    },
  ],

  // TASKS
  [
    "TaskCreated",
    (data: any) => {
      emit(createTaskAction({isSimple: true, newTask: data}))
    },
  ],
  [
    "TaskUpdated",
    (data: any) => {
      emit(updateTaskAction({isSimple: true, updatedTask: data}))
    },
  ],
  [
    "TaskStatusUpdated",
    (data: any) => {
      emit(updateTaskStatusAction({isSimple: true, updatedTask: data}))
    },
  ],
  [
    "TaskDeleted",
    (data: any) => {
      emit(deleteTaskAction({isSimple: true, id: data.taskId}))
    },
  ],

  // USERS

  [
    "UserSignedUp",
    (data: any) => {
      emit(uploadNewUser({data}));
    }
  ],
  [
    "UserUpdated",
    (data: any) => {
      emit(updateUserRoleAction({isSimple: true, user: data}))
    }
  ]
];
