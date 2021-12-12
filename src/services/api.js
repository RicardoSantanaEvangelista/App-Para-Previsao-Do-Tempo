import axios from 'axios';

//https://api.hgbrasil.com/weather?key=ed761397&lat=-23.682&lon=-46.875

export const key = '40729ad3';

const api = axios.create({
    baseURL: 'https://api.hgbrasil.com'
});

export default api;