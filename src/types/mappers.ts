import { User, UserRole } from ".";
import { AirtableUser, AirtableUserRole } from "./airtable";

export function mapRole(role: AirtableUserRole): UserRole {
    console.log(role)
    switch (role) {
        case "Участник":
            return "participant";
        case "Организатор":
        case "Жюри":
            return "admin";
        default:
            throw new Error(`Неизвестная роль: ${role}`);
    }
}

export function mapRoleToAirtable(role: UserRole): AirtableUserRole {
    console.log(role)
    switch (role) {
        case "participant":
            return "Участник";
        case "admin":
            return "Организатор";
        default:
            throw new Error(`Неизвестная роль: ${role}`);
    }
}

export function mapAirtableUserToUser(airtableUser: AirtableUser): User {
    console.log(airtableUser)
    return {
        id: airtableUser["ID"],
        email: airtableUser["Почта"],
        name: airtableUser["Полное имя"],
        role: mapRole(airtableUser["Роль"]),
    };
}

