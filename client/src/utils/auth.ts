import { deleteLocalItem } from './utils';

export const checkAuthorization = (error: any) => {
    if (error.request && error.request.status === 401 && error.response.data.message === 'Unauthorized') {
        deleteLocalItem('accessToken');
        window.location.href = '/login';
    }
}