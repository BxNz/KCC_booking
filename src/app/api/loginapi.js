import axios from 'axios'

// กำหนด Base URL และ Axios Instance
const api = axios.create({
  baseURL: 'http://115.84.105.127:9999',
  headers: {
    'Content-Type': 'application/json'
  }
})
export const loginuser = async(login,password)=>{
    const response = await api.post('/api/user/login1',{
        login,
        password
        } )
        // console.log("Full Response:", response.data)
    return response.data
}

export default api