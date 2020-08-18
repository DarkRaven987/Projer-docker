import {
    GET_TASKS_DATA_SAGA,
    CREATE_TASK_SAGA,
    UPDATE_TASK_SAGA,
    DELETE_TASK_SAGA,
    UPDATE_TASK_STATUS_SAGA
} from '../constant/tasks';

export const getTasksAction = (data: any) => ({
    type: GET_TASKS_DATA_SAGA,
    filters: data
})

export const createTaskAction = (data: any) => ({
    type: CREATE_TASK_SAGA,
    data
})

export const updateTaskAction = (data: any) => ({
    type: UPDATE_TASK_SAGA,
    data
})

export const updateTaskStatusAction = (data: any) => ({
    type: UPDATE_TASK_STATUS_SAGA,
    data
})

export const deleteTaskAction = (data: any) => ({
    type: DELETE_TASK_SAGA,
    data
});