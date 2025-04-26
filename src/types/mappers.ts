import { Hackathon, Team, User, UserRole } from ".";
import { AirtableTeam, AirtableUser, AirtableUserRole } from "./airtable";

export function mapRole(role: AirtableUserRole): UserRole {
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
    return {
        id: airtableUser["ID"],
        email: airtableUser["Почта"],
        name: airtableUser["Полное имя"],
        role: mapRole(airtableUser["Роль"]),
    };
}

const getStatus = (status: string ): "draft" | "upcoming" | "active" | "completed" => {
    switch (status) {
        case "Не опубликован":
            return "draft";
        case "Открыта регистрация":
            return "upcoming";
        case "Организатор":
        case "Хакатон начался":
            return "active"
        case "Закончился":
            return "completed";
        default:
            throw new Error(`Неизвестный статус: ${status}`);
    }
};


export const mapAirtableToHackathon = (record): Hackathon => {
    if(!record) return undefined;
    console.log('RECORD', record)

    const fields = record.fields;

    return {
        id: fields["ID"] || "",
        title: fields["Название"] || "",
        description: fields["Описание"] || "",
        publishDeadlineDate: fields["Дата публикации"] ? new Date(fields["Дата публикации"]).toISOString() : "",
        registrationDeadlineDate: fields["Дедлайн регистрации"] ? new Date(fields["Дедлайн регистрации"]).toISOString() : "",
        startDate: fields["Дата открытия кейсов"] ? new Date(fields["Дата открытия кейсов"]).toISOString() : "",
        endDate: fields["Дедлайн отправки (from Кейсы)"] ? new Date(fields["Дедлайн отправки (from Кейсы)"]).toISOString() : "",
        status: getStatus(fields["Статус"]),
        image: fields["Обложка"]?.[0]?.url,
        location: fields["Место проведения"] ,
    };
};


export function mapAirtableToTeam(record: AirtableTeam): Team {
    return {
        id: record["ID"].toString(),
        name: record["Название"],
        hackathonId: record["Хакатон"][0], // предполагаем, что Хакатон — это ссылка на запись с ID
        description: record["Описание"] || '',
        memberIds: record["Участники"], // Список участников
        projectId: record["Кейс"][0], // Ссылка на проект, если есть
        code: record["Код приглашения"], // Ссылка на проект, если есть
        createdBy: record["Лидер"][0] || '', // Используем Код приглашения как идентификатор создателя
    };
}

