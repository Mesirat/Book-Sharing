// import axios from "axios";
// let interceptorSet = false;

// export const setupAxiosInterceptors = () => {
//   if (interceptorSet) return;
//   interceptorSet = true;

//   axios.interceptors.response.use(
//     response => response,
//     async error => {
//       const originalRequest = error.config;
//       if (error.response?.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true;
//         try {
//           const res = await axios.post('http://localhost:5000/users/refreshToken', {
//             refreshToken: localStorage.getItem("refreshToken"),
//           });

//           const newAccessToken = res.data.accessToken;
//           localStorage.setItem("accessToken", newAccessToken);

//           axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
//           originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//           return axios(originalRequest);
//         } catch (refreshError) {
//           localStorage.removeItem("accessToken");
//           localStorage.removeItem("refreshToken");
//           window.location.href = "/login";
//           return Promise.reject(refreshError);
//         }
//       }

//       return Promise.reject(error);
//     }
//   );
// };