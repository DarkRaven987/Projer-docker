import {
  GET_PROJECTS_LIST_REDUCER,
  CREATE_PROJECT_REDUCER,
  UPDATE_PROJECT_REDUCER,
  DELETE_PROJECT_REDUCER,
} from "../constant/projects";

const initState = {
  projects: [],
  totalCount: 0,
  pages: 1
};

const projectsReducer = (
  state = initState,
  action: { type: string; data?: any }
) => {
  let pages = 0;
  switch (action.type) {
    case GET_PROJECTS_LIST_REDUCER:
      return {
        ...state,
        projects: [...action.data.projects],
        totalCount: action.data.totalCount,
        pages: action.data.pages,
      };
    case CREATE_PROJECT_REDUCER:
      pages = (state.totalCount + 1) % 10 === 1 ? state.pages + 1 : state.pages;
      return {
        ...state,
        projects: [...state.projects, action.data],
        totalCount: state.totalCount + 1,
        pages,
      };
    case UPDATE_PROJECT_REDUCER:
      const projectsArray = state.projects.map((project: any) => 
        project.id === action.data.id ? action.data : project
      );
      
      return {
        ...state,
        projects: projectsArray,
      };
    case DELETE_PROJECT_REDUCER:
      pages = (state.totalCount - 1) % 10 === 0 ? state.pages - 1 : state.pages;
      return {
        ...state,
        projects: state.projects.filter(
          (project: any) => project.id !== action.data
        ),
        totalCount: state.totalCount - 1,
        pages,
      };
    default:
      return {
        ...state,
      };
  }
};

export default projectsReducer;
