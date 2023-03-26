import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1/',
  // baseURL: 'http://101.101.216.129:8001/api/v1/',

  headers: {
    'X-CSRFToken': Cookies.get('csrftoken'),
    // Jwt: Cookies.get('access'),
    Authorization: 'Bearer ' + Cookies.get('access'),
  },
  withCredentials: true,
});

instance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refresh');
        const accessToken = Cookies.get('access');

        const newAccessToken = await postRefreshToken(
          refreshToken,
          accessToken
        );

        if (newAccessToken) {
          Cookies.set('access', newAccessToken);

          // Update the Authorization header with the new access token
          instance.defaults.headers['Authorization'] =
            'Bearer ' + newAccessToken;
          originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;

          return instance(originalRequest);
        } else {
          useNavigate('http://127.0.0.1:8000/api/v1/users/jwt-token-auth/');
          return Promise.reject(error);
        }
      } catch (refreshError) {
        useNavigate('http://127.0.0.1:8000/api/v1/users/jwt-token-auth/');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export async function userNameLogin({ username, password }) {
  const response = await fetch(
    'http://127.0.0.1:8000/api/v1/users/jwt-token-auth/  ',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    }
  );

  if (response.ok) {
    const data = await response.json();
    const refresh = data.refresh;
    const access = data.access;

    Cookies.set('access', access);
    Cookies.set('refresh', refresh);

    return true;
  } else {
    const { message } = await response.json();
    throw new Error(message);
  }
}
export async function postRefreshToken(refresh, access) {
  try {
    const response = await axios.post(
      'http://127.0.0.1:8000/api/v1/users/jwt-token-auth/refresh/',
      {
        refresh,
        access,
      }
    );
    return response.data.access;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}
// export function isTokenExpired(access) {
//   if (!access) return true;
//   const decodedToken = jwtDecode(access);
//   const currentTime = new Date().getTime() / 1000;
//   return decodedToken.exp < currentTime;
// }

export const signUpUser = data => {
  return instance.post('users/', data).then(res => res.data);
};

export const getMyProfile = () => {
  return instance.get('users/myprofile').then(res => res.data);
};
export const putMyProfile = () => {
  return instance.put('users/myprofile').then(res => res.data);
};
export const changeProfileUser = data => {
  return instance.put('users/myprofile', data).then(res => res.data);
};

export const getLectureInfo = () => {
  return instance.get(`users/myprofile`).then(res => res.data);
};
export const getLectureRate = () => {
  return instance.get(`lectures/mainpage`).then(res => res.data);
};

export const getLectureDetail = page => {
  return instance.get(`lectures/${page}`).then(res => res.data);
};

export const getLectureAndCategoryAndSearch = async ({ queryKey }) => {
  const [, bigCategory, smallCategory, page, searchName] = queryKey;

  if (searchName) {
    return await instance
      .get(
        `lectures/${bigCategory}/${smallCategory}/?page=${page}&search=${searchName}`
      )
      .then(res => res.data);
  } else {
    return await instance
      .get(`lectures/${bigCategory}/${smallCategory}/?page=${page}`)
      .then(res => res.data);
  }
};
export const postReview = ({ lectureNum, data }) => {
  return instance.post(`reviews/${lectureNum}`, data).then(res => res.data);
};

export const postReply = ({ lectureNum, reviewNum, data }) => {
  return instance
    .post(`reviews/${lectureNum}/${reviewNum}`, data)
    .then(res => res.data);
};
export const registerLecture = lectureNum => {
  return instance
    .put(`users/calculated-lectures/${lectureNum}/`, '')
    .then(res => res.status);
};
export const fetchVideoList = async ({ queryKey }) => {
  const [, lectureId, num] = queryKey;
  return await instance
    .get(`videos/lectures/${lectureId}/${num}`)
    .then(res => res.data);
};

export const savePlayedSeconds = ({ lectureId, num, lastPlayed }) => {
  return instance
    .put(`watchedlectures/${lectureId}/${num}`, { lastPlayed })
    .then(res => res.data);
};

// export const postReply = ({ lectureNum, reviewNum, data }) => {
//   return instance
//     .post(`reviews/${lectureNum}/${reviewNum}`, data)
//     .then(res => res.data);
// };
