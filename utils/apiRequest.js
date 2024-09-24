import axios from 'axios'

const apiRequest = async (params) => {
    let query = Object.entries(params).map( p => p.join('=') ).join('&')
    if (query !== null) query = `?${query}`;

    try {
        const res = await axios.get(`/api/timer${query}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })

        return {
            response: res,
            error: null,
        }
    } catch (err) {
        if (err.response) {
            if (err.response.data && err.response.data.error) {
                return {
                    response: err.response,
                    error: err.response.data.error,
                }
            }

            return {
                response: err.response,
                error: err,
            }
        }
        return {
            response: null,
            error: err,
        }
    }
}

export default apiRequest