import { put, call, select, takeLatest } from "redux-saga/effects";
import axios from "axios";

import {
  GET_TASKS_DATA_SAGA,
  GET_TASKS_DATA_REDUCER,
  CREATE_TASK_SAGA,
  UPDATE_TASK_SAGA,
  UPDATE_TASK_STATUS_SAGA,
  DELETE_TASK_SAGA,
  CREATE_TASK_REDUCER,
  UPDATE_TASK_REDUCER,
  UPDATE_TASK_STATUS_REDUCER,
  DELETE_TASK_REDUCER,
} from "../constant/tasks";
import { tasksUrl } from "../../utils/api";
import { checkAuthorization } from "../../utils/auth";
import { tasksPageSize } from "../../static";

function* getTasksRequest(data: any) {
  try {
    const { auth } = yield select();
    const { projectId, filter, page } = data.filters;
    const headers = { Authorization: `Bearer ${auth.auth_token}` };

    let URL = `${tasksUrl}?limit=${tasksPageSize}`;

    if (projectId) {
      URL += `&projectId=${projectId}`;
    }

    if (filter) {
      URL += `&filter=${filter}`;
    }

    if (page) {
      URL += `&page=${page}`;
    }

    const res = yield call(() =>
      axios.get(URL, {
        headers,
      })
    );

    yield put({ type: GET_TASKS_DATA_REDUCER, data: res.data });
  } catch (error) {
    checkAuthorization(error);
    console.log(error);
  }
}

function* createTaskRequest(data: any) {
  try {
    const {isSimple=false, newTask={}} = data.data;
    
    if (!isSimple) {
      const { auth } = yield select();
      const headers = { Authorization: `Bearer ${auth.auth_token}` };
      const body = {
        title: data.data.title,
        description: data.data.description,
        projectId: data.data.projectId
      };

      const res = yield call(() => {
        return axios.post(
          tasksUrl,
          body,
          {
            headers,          
          }
        )
      });

      yield put({type: CREATE_TASK_REDUCER, data: res.data});

    } else {

      yield put({type: CREATE_TASK_REDUCER, data: newTask});

    }

  } catch (error) {
    checkAuthorization(error);
    console.log(error);
  }
}

function* updateTaskRequest(data: any) {
  try {
    const {isSimple=false, updatedTask={}} = data.data;

    if (!isSimple) {
      const { auth } = yield select();
      const headers = { Authorization: `Bearer ${auth.auth_token}` };
      const body = {
        title: data.data.title,
        description: data.data.description,
        developerId: data.data.developerId  
      };

      const res = yield call(() => {
        return axios.patch(
          `${tasksUrl}/${data.data.id}`,
          body,
          {
            headers
          }
        )
      })

      yield put({ type: UPDATE_TASK_REDUCER, data: res.data });
    } else {
      yield put({ type: UPDATE_TASK_REDUCER, data: updatedTask });      
    }

  } catch (error) {
    checkAuthorization(error);
    console.log(error);
  }
}

function* updateTaskStatusRequest(data: any) {
  try {
    const {isSimple=false, updatedTask={}} = data.data;
    if (!isSimple) {
      const { auth } = yield select();
      const headers = { Authorization: `Bearer ${auth.auth_token}` };
      const URL = `${tasksUrl}/${data.data.id}/status`;
      const body = {
        status: data.data.status
      }
  
      const res = yield call(() => {
        return axios.patch(
          URL,
          body,
          {
            headers
          }
        )
      });
  
      yield put({type: UPDATE_TASK_STATUS_REDUCER, data: res.data});      
    } else {

      yield put({type: UPDATE_TASK_STATUS_REDUCER, data: updatedTask});    

    }
  } catch (error) {
    checkAuthorization(error);
    console.log(error);
  }
}

function* deleteTaskRequest(data: any) {
  try {
    const {isSimple=false, id=0} = data.data;

    if (!isSimple) {
      const { auth } = yield select();
      const headers = { Authorization: `Bearer ${auth.auth_token}` };
      yield call(() => {
        return axios.delete(tasksUrl, {
            headers,
            data: {
              id
            }
          }
        )
      });
    }


    yield put({type: DELETE_TASK_REDUCER, data: id});

  } catch (error) {
    checkAuthorization(error);
    console.log(error);
  }
}

function* tasksSagas() {
  yield takeLatest(GET_TASKS_DATA_SAGA, getTasksRequest);
  yield takeLatest(CREATE_TASK_SAGA, createTaskRequest);
  yield takeLatest(UPDATE_TASK_SAGA, updateTaskRequest);
  yield takeLatest(UPDATE_TASK_STATUS_SAGA, updateTaskStatusRequest);
  yield takeLatest(DELETE_TASK_SAGA, deleteTaskRequest);
}

export default tasksSagas;
