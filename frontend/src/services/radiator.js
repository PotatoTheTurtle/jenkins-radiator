import axios from "axios"

let token = null

export const setToken = newToken => {
  token = "bearer " + newToken
};

const tokenHeaders = (token) => {
  return {
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    }
  }
}

const baseurl = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? "http://localhost:3003/api" : "https://radiator-backend.herokuapp.com/api"

export const getAll = () => {
  const request = axios.get(`${baseurl}/radiator/`, tokenHeaders(token))
  return request.then(response => response.data)
    .catch(error => Promise.reject(error.response.status))
};

export const getRadiatorById = (id) =>{
  const request = axios.get(`${baseurl}/radiator/${id}`, tokenHeaders(token))
  return request.then(response => response.data)
    .catch(error => Promise.reject(error.response.status))
}

export const putRadiator = async (radiatorJson) => {
  const request = axios.put(`${baseurl}/radiator/`, radiatorJson, tokenHeaders(token))
  return request.then(() => Promise.resolve())
    .catch(error => Promise.reject(error.response.status))
}

export const putRadiatorSettings = async (radiatorJson) => {
  const request = axios.put(`${baseurl}/radiator/settings`, radiatorJson, tokenHeaders(token))
  return request.then(() => Promise.resolve())
    .catch(error => Promise.reject(error.response.status))
}

export const putGroup = async (categoryJson) => {
  const request = axios.put(`${baseurl}/radiator/group`, categoryJson, tokenHeaders(token))
  return request.then(() => Promise.resolve())
    .catch(error => Promise.reject(error.response.status))
}

export const putJob = async (jobJson) => {
  const request = axios.put(`${baseurl}/radiator/job`, jobJson, tokenHeaders(token))
  return request.then(() => Promise.resolve())
    .catch(error => Promise.reject(error.response.status))
}

export const getGroupById = async (id) => {
  const request = axios.get(`${baseurl}/radiator/group/${id}`, tokenHeaders(token))
  return request.then(response => response.data)
    .catch(error => Promise.reject(error.response.status))
}

export const getAllGroups = async () => {
  const request = axios.get(`${baseurl}/radiator/group`, tokenHeaders(token))
  return request.then(response => response.data)
    .catch(error => Promise.reject(error.response.status))
}

export const getAllJobs = async () => {
  const request = axios.get(`${baseurl}/radiator/job`, tokenHeaders(token))
  return request.then(response => response.data)
    .catch(error => Promise.reject(error.response.status))
}

export const postNewJob = async (payload)  => {
  const request = axios.post(`${baseurl}/radiator/job`, payload, tokenHeaders(token))
  return request.then(() => Promise.resolve())
    .catch(error => Promise.reject(error.response.status))
}

export const postNewGroup = async (payload) => {
  const request = axios.post(`${baseurl}/radiator/group`, payload, tokenHeaders(token))
  return request.then(() => Promise.resolve())
    .catch(error => Promise.reject(error.response.status))
}

export const postNewRadiator = async (payload)  => {
  const request = axios.post(`${baseurl}/radiator/`, payload, tokenHeaders(token))
  return request.then(() => Promise.resolve())
    .catch(error => Promise.reject(error.response.status))
}

export default { getAll, getRadiatorById, getGroupById, getAllGroups, putGroup, postNewRadiator, postNewGroup, postNewJob, getAllJobs, putJob, setToken }
