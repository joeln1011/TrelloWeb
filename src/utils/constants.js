let apiRoot = '';
// eslint-disable-next-line no-undef
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017';
}
// eslint-disable-next-line no-undef
if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trelloapi-512x.onrender.com';
}

export const API_ROOT = apiRoot;

export const DEFAULT_PAGE = 1;
export const DEFAULT_ITEM_PER_PAGE = 12;

export const CARD_MEMBER_ACTIONS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
};
