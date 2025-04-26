export type AirtableUserRole = "Участник" | "Организатор" | "Жюри";

export interface AirtableUser {
    "ID": string;
    "Почта": string;
    "Полное имя": string;
    "Роль": AirtableUserRole;
}

export interface AirtableTeam {
    "ID": number;
    "Артефакты": string[];
    "Дата создания": string;
    "Кейс": string[];
    "Код приглашения": string;
    "Название": string;
    "Описание": string;
    "Результаты": string[];
    "Участники": string[];
    "Хакатон": string;
}