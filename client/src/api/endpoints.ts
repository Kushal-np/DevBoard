export const API_BASE_URL = "http://localhost:8000/api" ; 

export const AUTH_ENDPOINTS = {
    LOGIN : `/user/login`,
    REGISTER : `/user/register`,
    LOGOUT : `/user/logout`,
    GET_ME : `/user/getMe`
    
}

export const FOLLOW_ENDPOINTS = {
    FOLLOW: `/user/follow`,
    UNFOLLOW : `/user/unfollow`
}

export const PROFILE_ENDPOINTS = {
    GET_PROFILE : (username:string) => `/profile/${username}`,
}

export const POST_ENDPOINTS = {
    CREATE_POST : `project/create-post` , 
    GET_POST : `project/get-post`, 
    GET_INDIVIDUAL_POST : (postId:string) => `project/get-post/${postId}`,
    GET_FEED : `project/getFeed` , 
    STAR_POST : (id:string) => `project/${id}/star` , 
}