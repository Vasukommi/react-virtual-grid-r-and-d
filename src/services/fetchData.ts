import axios from "axios";

const fetchData = async (url: string, payload: any) => {
    const response = await axios(url, payload);
    const requestedData = await response.data.data;
    return requestedData;
}

export default fetchData;