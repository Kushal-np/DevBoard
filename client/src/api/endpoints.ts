export const API_BASE_URL = "https://devboard-2-m2po.onrender.com/api";

export const AUTH_ENDPOINTS = {
  LOGIN: `/user/login`,
  REGISTER: `/user/register`,
  LOGOUT: `/user/logout`,
  GET_ME: `/user/getMe`,
};

export const FOLLOW_ENDPOINTS = {
  FOLLOW: (id: string) => `/user/follow/${id}`,
  UNFOLLOW: (id: string) => `/user/unfollow/${id}`,
  GETFOLLOWDATA: (id: string) => `/user/getFollowData/${id}`,
};

export const PROFILE_ENDPOINTS = {
  GET_PROFILE: (username: string) => `/profile/${username}`,
  EDIT: `/profile/edit`,
  CHANGE_PASSWORD: `/profile/change-password`,
  DELETE_ACCOUNT: `/profile`,
};

export const POST_ENDPOINTS = {
  CREATE_POST: `project/create-post`,
  GET_POST: `project/get-post`,
  GET_INDIVIDUAL_POST: (postId: string) => `project/get-post/${postId}`,
  UPDATE_POST: (postId: string) => `project/get-post/${postId}`,
  DELETE_POST: (postId: string) => `project/get-post/${postId}`,
  GET_FEED: `project/getFeed`,
  STAR_POST: (id: string) => `project/${id}/star`,
  GET_STARRED: `project/star`,
  GET_FEATURED: `project/featured`,
  GET_EXPLORE: `project/explore`,
  GET_BY_USER: (userId: string) => `project/user/${userId}`,
};

export const TEXT_POST_ENDPOINTS = {
  CREATE: `/posts`,
  FEED: `/posts/feed`,
  LIKED: `/posts/star`,
  BY_USER: (userId: string) => `/posts/user/${userId}`,
  LIKE: (id: string) => `/posts/${id}/like`,
  DELETE: (id: string) => `/posts/${id}`,
};

export const BOOKMARK_ENDPOINTS = {
  GET_ALL: `/bookmark`,
  TOGGLE: (id: string) => `/bookmark/${id}`,
};

export const COMMENT_ENDPOINTS = {
  CREATE: (projectId: string) => `/comment/${projectId}`,
  LIST: (projectId: string) => `/comment/${projectId}`,
  DELETE: (id: string) => `/comment/${id}`,
};

export const MESSAGE_ENDPOINTS = {
  CONVERSATIONS: `/chat/conversations`,
  START: `/chat/conversations`,
  GET_ONE: (conversationId: string) => `/chat/conversations/${conversationId}`,
  MESSAGES: (conversationId: string) => `/chat/conversations/${conversationId}/messages`,
};

export const NOTIFICATION_ENDPOINTS = {
  LIST: `/notification`,
  MARK_READ: (id: string) => `/notification/${id}/read`,
  MARK_ALL_READ: `/notification/read-all`,
};

export const SEARCH_ENDPOINTS = {
  USERS: `/search/users`,
  POSTS: `/search/posts`,
  TAGS: `/search/tags`,
};

export const RECOMMENDATION_ENDPOINT = `/user/recommendations`;
