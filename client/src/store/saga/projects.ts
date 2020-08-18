import { put, call, select, takeLatest } from "redux-saga/effects";
import Axios from "axios";

import {
  GET_PROJECTS_LIST_SAGA,
  CREATE_PROJECT_SAGA,
  UPDATE_PROJECT_SAGA,
  DELETE_PROJECT_SAGA,
  GET_PROJECTS_LIST_REDUCER,
  CREATE_PROJECT_REDUCER,
  UPDATE_PROJECT_REDUCER,
  DELETE_PROJECT_REDUCER
} from "../constant/projects";
import { projectsUrl } from "../../utils/api";
import { checkAuthorization } from "../../utils/auth";
import { projectsPageSize } from "../../static";

function* getProjectsRequest(data: any) {
  try {
    const { filter, page } = data.filters;
    const { auth } = yield select();
    const headers = { 'Authorization': `Bearer ${auth.auth_token}` };
    let URL = `${projectsUrl}?limit=${projectsPageSize}`

    if (filter) {
      URL += `&filter=${filter}`
    }

    if (page) {
      URL += `&page=${page}`
    }

    const res = yield call(() => {
      return Axios.get(
        URL,
        {
          headers
        }
      );
    });

    yield put({type: GET_PROJECTS_LIST_REDUCER, data: res.data})
  } catch (error) {
    checkAuthorization(error);
    console.log(error);
  }
}

function* createProjectRequest(data: any) {
  try {
    const { isSimple=false, newProject={}} = data.data;
     
    if (!isSimple) {
      const { auth } = yield select();
      const headers = { 'Authorization': `Bearer ${auth.auth_token}` };
      const body = {
        title: data.data.title,
        code: data.data.code,
        description: data.data.description,
      }
      const res = yield call(() => {
        return Axios.post(
          projectsUrl,
          body,
          {
            headers
          }
        );
      });

      yield put({type: CREATE_PROJECT_REDUCER, data: res.data});

    } else {

      yield put({type: CREATE_PROJECT_REDUCER, data: newProject});
      
    }
    
  } catch (error) {
    checkAuthorization(error);
    console.log(error);
  }
}

function* updateProjectRequest(data: any) {
  try {
    const { isSimple=false, updatedProject={} } = data.data;

    if (!isSimple) {
      const { auth } = yield select();
      const headers = { 'Authorization': `Bearer ${auth.auth_token}` };
      const { id, title, managerId, description, code } = data.data;
  
      const URL = `${projectsUrl}/${id}`
      const body = {
        title,
        managerId,
        description,
        code
      };
  
      const res = yield call(() => {
        return Axios.patch(
          URL,
          body,
          {
            headers
          }
        );
      });
  
      yield put({type: UPDATE_PROJECT_REDUCER, data: res.data});
    } else {
      yield put({type: UPDATE_PROJECT_REDUCER, data:  updatedProject});
    }
  } catch (error) {
    checkAuthorization(error);
    console.log(error);
  }
}

function* deleteProjectRequest(data: any) {
  try {
    const { id, isSimple=false } = data.data;

    if (!isSimple) {
      const { auth } = yield select();
      const headers = { 'Authorization': `Bearer ${auth.auth_token}` };

      yield call(() => {
        return Axios.delete(
          projectsUrl,
          {
            headers,
            data: {
              id
            }
          }
        );
      });      
    }
    
    yield put({type: DELETE_PROJECT_REDUCER, data: id});

  } catch (error) {
    checkAuthorization(error);
    console.log(error);
  }
}

function* projectsSagas() {
  yield takeLatest(GET_PROJECTS_LIST_SAGA, getProjectsRequest);
  yield takeLatest(CREATE_PROJECT_SAGA, createProjectRequest);
  yield takeLatest(UPDATE_PROJECT_SAGA, updateProjectRequest);
  yield takeLatest(DELETE_PROJECT_SAGA, deleteProjectRequest);
}

export default projectsSagas;
