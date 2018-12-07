import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
let config = null

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const setToken = (newToken) => {
    token = `bearer ${newToken}`
    config = {
        headers: { 'Authorization': token }
    }
}

const create = async (newObject) => {
    const response = await axios.post(baseUrl, newObject, config)
    return response.data
}

const update = async (id, newObject) => {
    const response = await axios.put(`${baseUrl}/${id}`, newObject)
    return response.data
}

const remove = async (id) => {
    const response = await axios.delete(`${baseUrl}/${id}`, config)
    return response.data
}

const createComment = async (id, newObject) => {
    const response = await axios.post(`${baseUrl}/${id}/comments`, newObject)
    return response.data
}

export default {
    getAll, create, update, remove, setToken, createComment
}