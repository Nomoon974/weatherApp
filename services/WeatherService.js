import axios from 'axios';

const API_KEY = '86737109563818a2e04c3ba63b076591';

export const getWeather = async (latitude, longitude) => {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
            lat: latitude,
            lon: longitude,
            units: 'metric',
            lang: 'fr',
            appid: API_KEY,
        },
    });
    return response.data;
};
