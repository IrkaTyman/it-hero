import { api, TABLES } from "./airtableClient";
import { mapAirtableToTeam } from "@/types/mappers.ts";

// 🔍 Поиск пользователя по Telegram ID
export const findTeamsByUserId = async (userId: string) => {
    const records = await api(TABLES.TEAMS)
        .select({
            filterByFormula: `FIND("${userId}", {Участники})`,
            maxRecords: 1
        })
        .firstPage();

    return mapAirtableToTeam(records[0].fields) || null;
};

// 🔍 Поиск команды по коду приглашения
export const findTeamByInviteCode = async (inviteCode: string) => {
    const records = await api(TABLES.TEAMS)
        .select({
            filterByFormula: `{Код приглашения} = "${inviteCode}"`,
            maxRecords: 1
        })
        .firstPage();

    if (records.length === 0) {
        throw new Error("Команда с таким кодом приглашения не найдена");
    }

    return {
        recordId: records[0].id, ...mapAirtableToTeam(records[0].fields)
    };
};

// 👥 Присоединение пользователя к команде по коду приглашения
export const joinTeamByInviteCode = async (inviteCode: string, userId: string) => {
    try {
        const records = await api(TABLES.USERS)
            .select({
                filterByFormula: `{ID} = "${userId}"`,
                maxRecords: 1
            })
            .firstPage();

        // Находим команду по коду приглашения
        const team = await findTeamByInviteCode(inviteCode);

        // Получаем текущий список участников
        let participants = team.memberIds || [];

        // Проверяем, не состоит ли пользователь уже в команде
        if (participants.includes(records[0].id)) {
            throw new Error("Вы уже состоите в этой команде");
        }

        // Добавляем пользователя в список участников
        participants.push(records[0].id);

        // Обновляем запись в базе данных
        await api(TABLES.TEAMS).update([
            {
                id: team.recordId,
                fields: {
                    "Участники": participants
                }
            }
        ]);

        return team;
    } catch (error) {
        console.error("Ошибка при присоединении к команде:", error);
        throw error;
    }
};