import {
    GET_PROJECTS_LIST_SAGA,
    CREATE_PROJECT_SAGA,
    UPDATE_PROJECT_SAGA,
    DELETE_PROJECT_SAGA
} from '../constant/projects';

export const getProjectsAction = (filters: any) => ({
    type: GET_PROJECTS_LIST_SAGA,
    filters,
})

export const createProjectsAction = (data: any) => ({
    type: CREATE_PROJECT_SAGA,
    data
})

export const updateProjectAction = (data: any) => ({
    type: UPDATE_PROJECT_SAGA,
    data
})

export const deleteProjectAction = (data: any) => ({
    type: DELETE_PROJECT_SAGA,
    data
})