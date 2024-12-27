import { apiSlice } from "./apiSlices";

const USERS_URL = '/users';
export const usersApiSlice = apiSlice.injectEndpoints({
   endpoints:(builder)=>({
    login:builder.mutation({
        query:(data)=>({
            url:`${USERS_URL}/login`,
            method:'POST',
            body:data,
        })
    })
   })
})
export const {useLoginMutation} = usersApiSlice;