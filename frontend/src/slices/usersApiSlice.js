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
    }),
    signup:builder.mutation({
        query:(data)=>({
            url:`${USERS_URL}/signup`,
            method:'POST',
            body:data,
        })
    }),
    logout:builder.mutation({
        query:()=>({
            url:`${USERS_URL}/logout`,
            method:'POST',
        })
    }),
    
   })
})
export const {useLoginMutation,useLogoutMutation,useSignupMutation} = usersApiSlice;