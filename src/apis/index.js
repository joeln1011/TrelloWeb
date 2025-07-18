import authorizeAxiosInstance from '~/utils/authorizeAxios';
import { API_ROOT } from '~/utils/constants';
import { toast } from 'react-toastify';
/** Boards */
// export const fetchBoardDetailsAPI = async (boardId) => {
//   const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`);
//   return response.data;
// };

/** Update Boards */
export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/boards/${boardId}`,
    updateData
  );
  return response.data;
};

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/boards/supports/moving_card`,
    updateData
  );
  return response.data;
};

/** Columns */
export const createNewColumnAPI = async (newColumnData) => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/columns`,
    newColumnData
  );
  return response.data;
};

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/columns/${columnId}`,
    updateData
  );
  return response.data;
};

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await authorizeAxiosInstance.delete(
    `${API_ROOT}/v1/columns/${columnId}`
  );
  return response.data;
};
/** Cards */
export const createNewCardAPI = async (newCardData) => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/cards`,
    newCardData
  );
  return response.data;
};

/** Users */

export const registerUserAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/users/register`,
    data
  );
  toast.success(
    'Account created successfully! Please check your email to verify your account.',
    {
      theme: 'colored',
    }
  );
  return response.data;
};

export const verifyUserAPI = async (data) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/users/verify`,
    data
  );
  toast.success('Account verified successfully! You can now login.', {
    theme: 'colored',
  });
  return response.data;
};

export const refreshTokenAPI = async () => {
  const response = await authorizeAxiosInstance.get(
    `${API_ROOT}/v1/users/refresh_token`
  );
  return response.data;
};

export const fetchBoardsAPI = async (searchPath) => {
  const response = await authorizeAxiosInstance.get(
    `${API_ROOT}/v1/boards${searchPath}`
  );
  return response.data;
};

export const createNewBoardAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/boards`,
    data
  );
  toast.success('Board created successfully!');
  return response.data;
};

export const updateCardDetailsAPI = async (cardId, updateData) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/cards/${cardId}`,
    updateData
  );
  return response.data;
};

export const inviteUserToBoardAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/invitations/board`,
    data
  );
  toast.success('User invited to board successfully!');
  return response.data;
};
