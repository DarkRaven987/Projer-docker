import {
  GET_TASKS_DATA_REDUCER,
  CREATE_TASK_REDUCER,
  UPDATE_TASK_REDUCER,
  UPDATE_TASK_STATUS_REDUCER,
  DELETE_TASK_REDUCER,
} from "../constant/tasks";

const initState = {
  tasks: [],
  totalCount: 0,
  pages: 1,
};

const tasksReducer = (
  state = initState,
  action: {
    type: string;
    data?: any;
  }
) => {
  let pages = 0;
  switch (action.type) {
    case GET_TASKS_DATA_REDUCER:
      return {
        ...state,
        tasks: [...action.data.tasks],
        totalCount: action.data.totalCount,
        pages: action.data.pages,
      };
    case CREATE_TASK_REDUCER:
      pages = (state.totalCount + 1) % 10 === 1 ? state.pages + 1 : state.pages;
      return {
        ...state,
        tasks: [...state.tasks, action.data],
        totalCount: state.totalCount + 1,
        pages,
      };
    case UPDATE_TASK_STATUS_REDUCER:
    case UPDATE_TASK_REDUCER:
      const tasksArray = state.tasks.map((task: any) => {
        if (task.id === action.data.id) {
          return action.data;
        }
        return task;
      });

      return {
        ...state,
        tasks: [...tasksArray],
      };
    case DELETE_TASK_REDUCER:
      pages = (state.totalCount - 1) % 10 === 0 ? state.pages - 1 : state.pages;
      return {
        ...state,
        tasks: [...state.tasks.filter((el: any) => el.id !== action.data)],
        totalCount: state.totalCount - 1,
        pages,
      };
    default:
      return {
        ...state,
      };
  }
};

export default tasksReducer;
