import cookie from 'react-cookies'

const BACK_AVAILABLE = ( process.env.REACT_APP_BACK_AVAILABLE === 'true' ? true : false ); 
const SESSION_TOKEN = process.env.REACT_APP_BACK_SESSION_TOKEN;
const ACCESS_TOKEN = process.env.REACT_APP_BACK_ACCESS_TOKEN;
const BACK_HOST_NAME = process.env.REACT_APP_BACK_API_HOST_NAME;
              
const doFetch = async (queryString,methodValue,params) => {
  const USER_TOKEN = typeof cookie.load('userToken') === 'undefined' ? '' : cookie.load('userToken');
  
  if (!BACK_AVAILABLE || !USER_TOKEN) {
    return {status:false,msg:'Backend not Available.',data:{}};
  }
  return fetch(BACK_HOST_NAME+queryString, {
    method: methodValue,
    headers: {
      'Authorization':`Token token=${ACCESS_TOKEN},member_token=${USER_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: (params ? JSON.stringify(params) : null)
  }).then((response) => {
      if (response.status !== 200) {
        return false;
      } else {
        return response.json();
      }
  }).then((responseData) => {
    if (!responseData) {
      return {status:false,msg:'Failed.',data:{}};
    } else {
      return {status:true,msg:'Successful.',data:responseData};
    }
  });
};

const doLoginFetch = async (queryString,methodValue,params) => {
  const defaultData={username:'',token:''};
  if (!BACK_AVAILABLE) {
    return {status:false,msg:'Backend not Available.',data:defaultData};
  }

  return fetch(BACK_HOST_NAME+queryString, {
    method: methodValue,
    headers: {
      'Authorization':`Token token=${SESSION_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  }).then((response) => {
      if (response.status !== 200) {
        return false;
      } else {
        return response.json();
      }
  }).then((responseData) => {
    if (!responseData) {
      return {status:false,msg:'Failed.',data:defaultData};
    } else {
      return responseData;
    }
  });
};

export const loginAPI = async (username,password) => {
  const queryString='sign_in';
  const methodValue='POST';
  const params={
    "username":username,
    "password":password
  }
  return await doLoginFetch(queryString,methodValue,params);
};

export const logoutAPI = async (username) => {
  const queryString=`sign_out`;
  const methodValue='POST';
  const params={
    "username":username
  }
  return await doFetch(queryString,methodValue,params);
};

/* Member */
export const getMembers = async () => {
  const queryString='members?showAll=1';
  const methodValue='GET';
  const params=null;
  return await doFetch(queryString,methodValue,params);
};

export const getMemberInfo = async () => {
  const queryString='members';
  const methodValue='GET';
  const params=null;
  return await doFetch(queryString,methodValue,params);
};

export const getMemberId = async (id) => {
  const queryString=`members/${id}`;
  const methodValue='GET';
  const params=null;
  return await doFetch(queryString,methodValue,params);
};

/* ComponentCategory */
export const getCategories = async () => {
  const queryString='component_categories';
  const methodValue='GET';
  const params=null;
  return await doFetch(queryString,methodValue,params);
};

export const getCategoryId = async (id) => {
  const queryString=`component_categories/${id}`;
  const methodValue='GET';
  const params=null;
  return await doFetch(queryString,methodValue,params);
};

export const createCategory = async (name, description) => {
  const queryString='component_categories';
  const methodValue='POST';
  const params={
    "name":name,
    "description":description
  };
  return await doFetch(queryString,methodValue,params);
};

export const deleteCategory = async (id) => {
  const queryString=`component_categories/${id}`;
  const methodValue='DELETE';
  const params=null;
  return await doFetch(queryString,methodValue,params);
};

/* Component */
export const getComponents = async () => {
  const queryString='components';
  const methodValue='GET';
  const params=null;
  return await doFetch(queryString,methodValue,params);
};

export const getComponentsSuffix = async (suffix) => {
  const queryString=`components?suffix=${suffix}`;
  const methodValue='GET';
  const params=null;
  return await doFetch(queryString,methodValue,params);
};

export const getComponentId = async (id) => {
  const queryString=`components/${id}`;
  const methodValue='GET';
  const params=null;
  return await doFetch(queryString,methodValue,params);
};

export const createComponent = async (name, category, img_path, stock) => {
  const queryString='components';
  const methodValue='POST';
  const params={
    "name": name,
    "category": category,
    "img_path": img_path,
    "stock": stock
  };
  return await doFetch(queryString,methodValue,params);
};

export const updateComponent = async (id, stock, add) => {
  const queryString=`components/${id}`;
  const methodValue='PUT';
  const params={
    "stock": stock,
    "add": add,
  };
  return await doFetch(queryString,methodValue,params);
};

export const deleteComponent = async (id, stock, add) => {
  const queryString=`components/${id}`;
  const methodValue='DELETE';
  const params=null;
  return await doFetch(queryString,methodValue,params);
};

/*Reservation*/
export const createReservation = async (details) => {
  const queryString='reservations';
  const methodValue='POST';
  const params={
    "details": details
  };
  return await doFetch(queryString,methodValue,params);
};

export const showHistory = async () => {
  const queryString=`reservations?showValue=1`;
  const methodValue='GET';
  const params=null;
  return await doFetch(queryString,methodValue,params);
};

export const showReturned = async () => {
  const queryString=`reservations?showValue=2`;
  const methodValue='GET';
  const params=null;
  return await doFetch(queryString,methodValue,params);
};

export const showCurrent = async () => {
  const queryString=`reservations?showValue=3`;
  const methodValue='GET';
  const params=null;
  return await doFetch(queryString,methodValue,params);
};

export const uuidActions = async (uuid) => {
  const queryString=`reservations/${uuid}`;
  const methodValue='GET';
  const params=null;
  return await doFetch(queryString,methodValue,params);
};

export const updateReservation = async (details) => {
  const queryString=`reservations/1`;
  const methodValue='PUT';
  const params={
    "details":details
  };
  return await doFetch(queryString,methodValue,params);
};