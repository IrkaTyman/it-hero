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
        "ID": created[0].fields["ID"].toString(),
        'Полное имя': created[0].fields["Полное имя"].toString(),
        'Почта': created[0].fields["Почта"].toString(),
        'Роль': created[0].fields["Роль"] as AirtableUserRole
    };
};

// 🔹 Авторизация пользователя
export const loginUser = async (email: string, password: string) => {
    const user = await findUserByEmail(email);

    if (!user) throw new Error('Пользователь не найден');
    if (user.fields['Пароль'] !== password) throw new Error('Неверный пароль');

    console.log(user)
    return {
        "ID": user.fields["ID"].toString(),
        'Полное имя': user.fields["Полное имя"].toString(),
        'Почта': user.fields["Почта"].toString(),
        'Роль': user.fields["Роль"] as AirtableUserRole
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


