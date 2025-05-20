import { HttpClient } from "./HttpClient";
import axios from 'axios'

export class AxiosAdapter implements HttpClient{
    async get(url: string): Promise<any> {
        const data = await axios.get(url)
        return data.data
    }

    async post(url: string, body: any): Promise<any> {
        const data = await axios.post(url, body)
        return data.data
    }
}