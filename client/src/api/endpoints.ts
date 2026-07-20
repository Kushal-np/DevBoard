export const API_BASE_URL = "http://localhost:8000/api";

export const AUTH_ENDPOINTS = {
    LOGIN: `/user/login`,
    REGISTER: `/user/register`,
    LOGOUT: `/user/logout`,
    GET_ME: `/user/getMe`

}

export const FOLLOW_ENDPOINTS = {
    FOLLOW: (id: string) => `/user/follow/${id}`,
    UNFOLLOW: (id: string) => `/user/unfollow/${id}`,
    GETFOLLOWDATA: (id: string) => `/user/getFollowData/${id}`
}

export const PROFILE_ENDPOINTS = {
    GET_PROFILE: (username: string) => `/profile/${username}`,
}

export const POST_ENDPOINTS = {
    CREATE_POST: `project/create-post`,
    GET_POST: `project/get-post`,
    GET_INDIVIDUAL_POST: (postId: string) => `project/get-post/${postId}`,
    GET_FEED: `project/getFeed`,
    STAR_POST: (id: string) => `project/${id}/star`,
    GET_STARRED: `project/star`,
    GET_FEATURED: `project/featured`,
    GET_EXPLORE: `project/explore`,
}

export const BOOKMARK_ENDPOINTS = {
    GET_ALL: `/bookmark`,
    TOGGLE: (id: string) => `/bookmark/${id}`,
};

export const COMMENT_ENDPOINTS = {
    LIST: (projectId: string) => `/comment/${projectId}`,
    DELETE: (id: string) => `/comment/${id}`,
};

export const MESSAGE_ENDPOINTS = {
    CONVERSATIONS: `/message/conversations`,
    START: (userId: string) => `/message/conversations/${userId}`,
    MESSAGES: (conversationId: string) => `/message/${conversationId}`,
};

export const SEARCH_ENDPOINTS = {
    USERS: `/search/users`,
    POSTS: `/search/posts`,
    TAGS: `/search/tags`,
};

export const RECOMMENDATION_ENDPOINT = `/user/recommendations`;

