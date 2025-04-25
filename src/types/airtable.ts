export type AirtableUserRole = "Участник" | "Организатор" | "Жюри";

export interface AirtableUser {
    "ID": string;
    "Почта": string;
    "Полное имя": string;
    "Роль": AirtableUserRole;
}