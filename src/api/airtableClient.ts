import Airtable from 'airtable';

const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;
const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;

if (!apiKey || !baseId) {
    throw new Error('Airtable API key or Base ID is missing');
}

export const api = new Airtable({ apiKey }).base(baseId);

export const TABLES = {
    USERS: "Пользователи"
}