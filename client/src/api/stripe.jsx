import axios from 'axios'


export const payment = async (token) => 
    await axios.post('http://localhost:5001/api/user/finalize-order', {}, {
    headers: {
        Authorization: `Bearer ${token}`
    }
})