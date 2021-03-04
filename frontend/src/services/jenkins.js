import axios from "axios"

const headers = (url, token) => {
  return {
    mode: 'no-cors',
    headers:{
      "Access-Control-Allow-Credentials": "true",
    }
  }
}



export const getBuilds = (jenkinsUrl, buildAmount, token) => {
  const request = axios.get( `${jenkinsUrl}/api/json?tree=allBuilds[url,result,id]{0,${buildAmount}}`)
  return request.then(response => response.data)
    .catch(error => Promise.reject(error.response.status))
};

export const getAllJenkins = (jenkinsUrl, buildAmount) => {
  const request = axios.get( `http://localhost:3003/api/jenkins/`)
  return request.then(response => response.data)
    .catch(error => Promise.reject(error.response.status))
};

export const getJenkinsById = async (id) => {
  const request = axios.get(`http://localhost:3003/api/jenkins/${id}`)
  return request.then(response => response.data)
    .catch(error => Promise.reject(error.response.status))
}

export const postNewJenkins = async (payload) => {
  const request = axios.post(`http://localhost:3003/api/jenkins/`, payload)
  return request.then(() => Promise.resolve())
    .catch(error => Promise.reject(error.response.status))
}



export default { getBuilds, getAllJenkins, getJenkinsById, postNewJenkins }