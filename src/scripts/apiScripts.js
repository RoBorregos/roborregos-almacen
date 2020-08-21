import cookie from 'react-cookies'

const BACK_AVAILABLE = ( process.env.REACT_APP_BACK_API_AVAILABLE === 'true' ? true : false ); 
const API_KEY = process.env.REACT_APP_BACK_API_KEY;
const BACK_HOST_NAME = process.env.REACT_APP_BACK_API_HOST_NAME;
              
const doFetch = async (queryString,methodValue,withResponse) => {
  const USER_TOKEN = typeof cookie.load('userToken') === 'undefined' ? '' : cookie.load('userToken');
  
  if(!BACK_AVAILABLE || !USER_TOKEN) {
    return {status:false,msg:'Backend not Available.',data:{}};
  }

  return fetch(BACK_HOST_NAME+queryString, {
    method: methodValue,
    headers: {
      'Authorization':'Token token='+API_KEY+',member_token='+USER_TOKEN
    }
  }).then((response) => {
      if(response.status !== 200) {
        return false;
      }else {
        if(withResponse){
          return response.json();
        }
        return true;
      }
  }).then((responseData) => {
    if(!responseData) {
      return {status:false,msg:'Failed.',data:{}};
    }else {
      return {status:true,msg:'Successful.',data:responseData};
    }
  });
};

export const loginAPI = async (username,password) => {
  const queryString='sign_in?username='+username+'&password='+password;
  
  if(!BACK_AVAILABLE) {
    return {username:'User',token:''};
  }

  return fetch(BACK_HOST_NAME+queryString, {
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
  const queryString='sign_out?username='+username;
  const methodValue='POST';
  const withResponse=false;
  return await doFetch(queryString,methodValue,withResponse);
};

export const getMemberInfo = async (username) => {
  const queryString='members/actions/showByUsername?username='+username;
  const methodValue='GET';
  const withResponse=true;
  return await doFetch(queryString,methodValue,withResponse);
};

export const getCategories = async () => {
  const queryString='component_categories';
  const methodValue='GET';
  const withResponse=true;
  return await doFetch(queryString,methodValue,withResponse);
};

export const getComponents = async () => {
  const queryString='components';
  const methodValue='GET';
  const withResponse=true;
  return await doFetch(queryString,methodValue,withResponse);
};

export const getCurrentReservations = async (username) => {
  const queryString='reservations/actions/showCurrentByUsername?username='+username;
  const methodValue='GET';
  const withResponse=true;
  return await doFetch(queryString,methodValue,withResponse);
};

export const getHistoryReservations = async (username) => {
  const queryString='reservations/actions/showHistoryByUsername?username='+username;
  const methodValue='GET';
  const withResponse=true;
  return await doFetch(queryString,methodValue,withResponse);
};


