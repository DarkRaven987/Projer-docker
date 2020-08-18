import {
    GET_USERS_SAGA,
    UPDATE_USER_ROLE_SAGA,
    GET_USERS_ROLES_SAGA,
    RESET_PASSWORD_SAGA,
    UPLOAD_NEW_USER_SAGA
} from '../constant/users';

export const getUsersAction = (filters: any) => ({
    type: GET_USERS_SAGA,
    filters
});

export const uploadNewUser = (data: any) => ({
    type: UPLOAD_NEW_USER_SAGA,
    data
})

export const updateUserRoleAction = (data: any) => ({
    type: UPDATE_USER_ROLE_SAGA,
    data
});

export const getUsersRolesAction = () => ({
    type: GET_USERS_ROLES_SAGA
});

export const resetPasswordRequest = (data: any) => ({
    type: RESET_PASSWORD_SAGA,
    data
})

