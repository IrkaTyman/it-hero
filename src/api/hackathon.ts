import { api, TABLES } from "@/api/airtableClient.ts";
import { mapAirtableToHackathon } from "@/types/mappers.ts";

export const findActiveHackathon = async () => {
    const records = await api(TABLES.HACKATHONS)
        .select({
            filterByFormula: `{Статус} = 'Хакатон начался'`,
        })
        .firstPage();

    return records.map((hackathon) => mapAirtableToHackathon(hackathon)) || [null];
};


export const findUpcomingHackathon = async () => {
    const records = await api(TABLES.HACKATHONS)
        .select({
            filterByFormula: `{Статус} = 'Открыта регистрация'`,
        })
        .firstPage();

    return records.map((hackathon) => mapAirtableToHackathon(hackathon)) || [null];
};


export const findCompletedHackathon = async () => {
    const records = await api(TABLES.HACKATHONS)
        .select({
            filterByFormula: `{Статус} = 'Закончился'`,
        })
        .firstPage();

    return records.map((hackathon) => mapAirtableToHackathon(hackathon)) || [null];
};

export const findAllHackathon = async () => {
    const records = await api(TABLES.HACKATHONS)
        .select()
        .firstPage();

    return records.map((hackathon) => mapAirtableToHackathon(hackathon)) || [null];
};

export const findHackathonById = async (id: string) => {
    const records = await api(TABLES.HACKATHONS)
        .select({
            filterByFormula: `{ID} = ${id}`,
            maxRecords: 1,
        })
        .firstPage();

    return mapAirtableToHackathon(records[0]);
};