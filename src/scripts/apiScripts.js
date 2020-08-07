import cookie from 'react-cookies'

export const BACK_AVAILABLE = ( process.env.REACT_APP_BACK_API_AVAILABLE == 'true' ? true : false ); 
export const API_KEY = process.env.REACT_APP_BACK_API_KEY;
export const BACK_HOST_NAME = process.env.REACT_APP_BACK_API_HOST_NAME;
                             
export const loginAPI = async (username,password) => {
  const query_string='?username='+username+'&password='+password;
  
  if(!BACK_AVAILABLE) {
    return {username:'User',token:''};
  }

  return fetch(BACK_HOST_NAME+'sign_in'+query_string, {
      method: 'POST',
      headers: {
          'Authorization':'Token token='+API_KEY
      }
    }).then((response) => {
        if(response.status !== 200) {
          return {username:'',token:''};
        }else {
          return response.json();
        }
    }).then((responseData) => {
        return responseData;
    })
};

export const logoutAPI = async (username) => {
  const USER_TOKEN = typeof cookie.load('userToken') === 'undefined' ? '' : cookie.load('userToken');
  const query_string='?username='+username;
  
  if(!BACK_AVAILABLE || !USER_TOKEN) {
    return {success:true};
  }

  return fetch(BACK_HOST_NAME+'sign_out'+query_string, {
      method: 'POST',
      headers: {
          'Authorization':'Token token='+API_KEY+',member_token='+USER_TOKEN
      }
    }).then((response) => {
        if(response.status !== 200) {
          return {success:false};
        }else {
          return {success:true};
        }
    });
};
