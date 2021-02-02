import axios from "axios"

let token = null

export const setToken = newToken => {
  token = "bearer " + newToken
};

const headers = {
  headers: {
    "Content-Type": "application/json"
  }
}

export const getAll = () => {
  const request = axios.get("http://localhost:3003/api/radiator/")
  return request.then(response => response.data)
    .catch(error => Promise.reject(error.response.status))
};

export const getRadiatorById = (id) =>{
  const request = axios.get("http://localhost:3003/api/radiator/" + id)
  return request.then(response => response.data)
    .catch(error => Promise.reject(error.response.status))
}

export const putRadiator = async (radiatorJson) => {
  const request = axios.put("http://localhost:3003/api/radiator/", radiatorJson, headers)
  return request.then(() => Promise.resolve())
    .catch(error => Promise.reject(error.response.status))
}

export const putRadiatorSettings = async (radiatorJson) => {
  const request = axios.put("http://localhost:3003/api/radiator/settings", radiatorJson, headers)
  return request.then(() => Promise.resolve())
    .catch(error => Promise.reject(error.response.status))
}

export const putGroup = async (categoryJson) => {
  const request = axios.put("http://localhost:3003/api/radiator/group/", categoryJson, headers)
  return request.then(() => Promise.resolve())
    .catch(error => Promise.reject(error.response.status))
}

export const putJob = async (jobJson) => {
  const request = axios.put("http://localhost:3003/api/radiator/job/", jobJson, headers)
  return request.then(() => Promise.resolve())
    .catch(error => Promise.reject(error.response.status))
}

export const getGroupById = async (id) => {
  const request = axios.get("http://localhost:3003/api/radiator/group/" + id)
  return request.then(response => response.data)
    .catch(error => Promise.reject(error.response.status))
}

export const getAllGroups = async () => {
  const request = axios.get("http://localhost:3003/api/radiator/group/")
  return request.then(response => response.data)
    .catch(error => Promise.reject(error.response.status))
}

export const getAllJobs = async () => {
  const request = axios.get("http://localhost:3003/api/radiator/job/")
  return request.then(response => response.data)
    .catch(error => Promise.reject(error.response.status))
}

export const postNewJob = async (payload)  => {
  const request = axios.post("http://localhost:3003/api/radiator/job/", payload, headers)
  return request.then(() => Promise.resolve())
    .catch(error => Promise.reject(error.response.status))
}

export const postNewGroup = async (payload) => {
  const request = axios.post("http://localhost:3003/api/radiator/group/", payload, headers)
  return request.then(() => Promise.resolve())
    .catch(error => Promise.reject(error.response.status))
}

export const postNewRadiator = async (payload)  => {
  const request = axios.post("http://localhost:3003/api/radiator/", payload, headers)
  return request.then(() => Promise.resolve())
    .catch(error => Promise.reject(error.response.status))
}

export default { getAll, getRadiatorById, getGroupById, getAllGroups, putGroup, postNewRadiator, postNewGroup, postNewJob, getAllJobs, putJob, setToken }
