import { api, TABLES } from "./airtableClient";
import { AirtableUser, AirtableUserRole } from "@/types/airtable.ts";

// 🔹 Регистрация нового пользователя
export const registerUser = async ({
                                       password,
                                       fullName,
                                       email,
                                   }: {
    password: string;
    fullName: string;
    email: string;
}): Promise<AirtableUser> => {
    console.log("AAAWJDKHJAJKWDNKJAWD")
    const existing = await findUserByEmail(email);
    if (existing) throw new Error('Пользователь с таким Email уже существует');

    const created = await api(TABLES.USERS).create([{
        fields: {
            'Пароль': password,
            'Полное имя': fullName,
            'Почта': email,
            'Роль': "Участник",
        }
    }]);

    return {
        "ID": created[0].id,
        'Полное имя': created[0].fields["Полное имя"].toString(),
        'Почта': created[0].fields["Почта"].toString(),
        'Роль': created[0].fields["Роль"] as AirtableUserRole
    };
};

// 🔹 Авторизация пользователя
export const authorizeUser = async (email: string, password: string) => {
    const user = await findUserByEmail(email);

    if (!user) throw new Error('Пользователь не найден');
    if (user.fields['Пароль'] !== password) throw new Error('Неверный пароль');

    return {
        id: user.id,
        fields: user.fields,
    };
};

// 🔍 Поиск пользователя по Telegram ID
const findUserByEmail = async (email: string) => {
    const records = await api(TABLES.USERS)
        .select({
            filterByFormula: `{Почта} = '${email}'`,
            maxRecords: 1,
        })
        .firstPage();

    return records[0] || null;
};
