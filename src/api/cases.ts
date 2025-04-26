import { api, TABLES } from "./airtableClient";

// Интерфейс для кейса
export interface Case {
  id: string;
  number: number;
  name: string;
  description: string;
  resultsUploadInfo?: string;
  deadline: string;
  hackathonIds: string[];
  teamIds: string[];
  linkIds: string[];
}

// Интерфейс для создания нового кейса
export interface CreateCaseData {
  name: string;
  description: string;
  resultsUploadInfo?: string;
  deadline: string;
  hackathonIds: string[];
}

// Интерфейс для обновления кейса
export interface UpdateCaseData {
  name?: string;
  description?: string;
  resultsUploadInfo?: string;
  deadline?: string;
  hackathonIds?: string[];
}

/**
 * Получает список всех кейсов
 * @returns Массив кейсов
 */
export const getAllCases = async (): Promise<Case[]> => {
  try {
    const records = await api(TABLES.CASES)
      .select({
        sort: [{ field: "ID", direction: "asc" }]
      })
      .firstPage();

    return records.map(record => ({
      id: record.id,
      number: record.fields["ID"] as number,
      name: record.fields["Название"] as string,
      description: record.fields["Описание"] as string,
      resultsUploadInfo: record.fields["Результаты для загрузки"] as string,
      deadline: record.fields["Дедлайн отправки"] as string,
      hackathonIds: record.fields["Хакатон"] as string[] || [],
      teamIds: record.fields["Команды"] as string[] || [],
      linkIds: record.fields["Links"] as string[] || []
    }));
  } catch (error) {
    console.error("Ошибка при получении кейсов:", error);
    throw error;
  }
};

/**
 * Получает кейс по ID
 * @param caseId ID кейса
 * @returns Данные кейса
 */
export const getCaseById = async (caseId: string): Promise<Case | null> => {
  try {
    const record = await api(TABLES.CASES).find(caseId);
    
    return {
      id: record.id,
      number: record.fields["ID"] as number,
      name: record.fields["Название"] as string,
      description: record.fields["Описание"] as string,
      resultsUploadInfo: record.fields["Результаты для загрузки"] as string,
      deadline: record.fields["Дедлайн отправки"] as string,
      hackathonIds: record.fields["Хакатон"] as string[] || [],
      teamIds: record.fields["Команды"] as string[] || [],
      linkIds: record.fields["Links"] as string[] || []
    };
  } catch (error) {
    console.error(`Ошибка при получении кейса с ID ${caseId}:`, error);
    return null;
  }
};

/**
 * Получает кейсы для конкретного хакатона
 * @param hackathonId ID хакатона
 * @returns Массив кейсов
 */
export const getCasesByHackathonId = async (hackathonId: string): Promise<Case[]> => {
  try {
    const records = await api(TABLES.CASES)
      .select({
        filterByFormula: `FIND("${hackathonId}", {Хакатон})`,
        sort: [{ field: "ID", direction: "asc" }]
      })
      .firstPage();

    return records.map(record => ({
      id: record.id,
      number: record.fields["ID"] as number,
      name: record.fields["Название"] as string,
      description: record.fields["Описание"] as string,
      resultsUploadInfo: record.fields["Результаты для загрузки"] as string,
      deadline: record.fields["Дедлайн отправки"] as string,
      hackathonIds: record.fields["Хакатон"] as string[] || [],
      teamIds: record.fields["Команды"] as string[] || [],
      linkIds: record.fields["Links"] as string[] || []
    }));
  } catch (error) {
    console.error(`Ошибка при получении кейсов для хакатона ${hackathonId}:`, error);
    throw error;
  }
};

/**
 * Создает новый кейс
 * @param caseData Данные для создания кейса
 * @returns Созданный кейс
 */
export const createCase = async (caseData: CreateCaseData): Promise<Case> => {
  try {
    const records = await api(TABLES.CASES).create([
      {
        fields: {
          "Название": caseData.name,
          "Описание": caseData.description,
          "Результаты для загрузки": caseData.resultsUploadInfo,
          "Дедлайн отправки": caseData.deadline,
          "Хакатон": caseData.hackathonIds
        }
      }
    ]);

    const record = records[0];
    return {
      id: record.id,
      number: record.fields["ID"] as number,
      name: record.fields["Название"] as string,
      description: record.fields["Описание"] as string,
      resultsUploadInfo: record.fields["Результаты для загрузки"] as string,
      deadline: record.fields["Дедлайн отправки"] as string,
      hackathonIds: record.fields["Хакатон"] as string[] || [],
      teamIds: record.fields["Команды"] as string[] || [],
      linkIds: record.fields["Links"] as string[] || []
    };
  } catch (error) {
    console.error("Ошибка при создании кейса:", error);
    throw error;
  }
};

/**
 * Обновляет существующий кейс
 * @param caseId ID кейса
 * @param caseData Данные для обновления
 * @returns Обновленный кейс
 */
export const updateCase = async (caseId: string, caseData: UpdateCaseData): Promise<Case> => {
  try {
    const fields: Record<string, any> = {};
    
    if (caseData.name) fields["Название"] = caseData.name;
    if (caseData.description) fields["Описание"] = caseData.description;
    if (caseData.resultsUploadInfo) fields["Результаты для загрузки"] = caseData.resultsUploadInfo;
    if (caseData.deadline) fields["Дедлайн отправки"] = caseData.deadline;
    if (caseData.hackathonIds) fields["Хакатон"] = caseData.hackathonIds;

    const records = await api(TABLES.CASES).update([
      {
        id: caseId,
        fields
      }
    ]);

    const record = records[0];
    return {
      id: record.id,
      number: record.fields["ID"] as number,
      name: record.fields["Название"] as string,
      description: record.fields["Описание"] as string,
      resultsUploadInfo: record.fields["Результаты для загрузки"] as string,
      deadline: record.fields["Дедлайн отправки"] as string,
      hackathonIds: record.fields["Хакатон"] as string[] || [],
      teamIds: record.fields["Команды"] as string[] || [],
      linkIds: record.fields["Links"] as string[] || []
    };
  } catch (error) {
    console.error(`Ошибка при обновлении кейса с ID ${caseId}:`, error);
    throw error;
  }
};

/**
 * Удаляет кейс
 * @param caseId ID кейса
 * @returns Результат удаления
 */
export const deleteCase = async (caseId: string): Promise<{ success: boolean }> => {
  try {
    await api(TABLES.CASES).destroy([caseId]);
    return { success: true };
  } catch (error) {
    console.error(`Ошибка при удалении кейса с ID ${caseId}:`, error);
    throw error;
  }
};

/**
 * Назначает команду на кейс
 * @param caseId ID кейса
 * @param teamId ID команды
 * @returns Обновленный кейс
 */
export const assignTeamToCase = async (caseId: string, teamId: string): Promise<Case> => {
  try {
    // Получаем текущий кейс
    const currentCase = await getCaseById(caseId);
    if (!currentCase) {
      throw new Error(`Кейс с ID ${caseId} не найден`);
    }

    // Добавляем команду, если она еще не назначена
    const teamIds = [...(currentCase.teamIds || [])];
    if (!teamIds.includes(teamId)) {
      teamIds.push(teamId);
    }

    // Обновляем кейс
    const records = await api(TABLES.CASES).update([
      {
        id: caseId,
        fields: {
          "Команды": teamIds
        }
      }
    ]);

    const record = records[0];
    return {
      id: record.id,
      number: record.fields["ID"] as number,
      name: record.fields["Название"] as string,
      description: record.fields["Описание"] as string,
      resultsUploadInfo: record.fields["Результаты для загрузки"] as string,
      deadline: record.fields["Дедлайн отправки"] as string,
      hackathonIds: record.fields["Хакатон"] as string[] || [],
      teamIds: record.fields["Команды"] as string[] || [],
      linkIds: record.fields["Links"] as string[] || []
    };
  } catch (error) {
    console.error(`Ошибка при назначении команды ${teamId} на кейс ${caseId}:`, error);
    throw error;
  }
};

/**
 * Отменяет назначение команды на кейс
 * @param caseId ID кейса
 * @param teamId ID команды
 * @returns Обновленный кейс
 */
export const unassignTeamFromCase = async (caseId: string, teamId: string): Promise<Case> => {
  try {
    // Получаем текущий кейс
    const currentCase = await getCaseById(caseId);
    if (!currentCase) {
      throw new Error(`Кейс с ID ${caseId} не найден`);
    }

    // Удаляем команду из списка
    const teamIds = (currentCase.teamIds || []).filter(id => id !== teamId);

    // Обновляем кейс
    const records = await api(TABLES.CASES).update([
      {
        id: caseId,
        fields: {
          "Команды": teamIds
        }
      }
    ]);

    const record = records[0];
    return {
      id: record.id,
      number: record.fields["ID"] as number,
      name: record.fields["Название"] as string,
      description: record.fields["Описание"] as string,
      resultsUploadInfo: record.fields["Результаты для загрузки"] as string,
      deadline: record.fields["Дедлайн отправки"] as string,
      hackathonIds: record.fields["Хакатон"] as string[] || [],
      teamIds: record.fields["Команды"] as string[] || [],
      linkIds: record.fields["Links"] as string[] || []
    };
  } catch (error) {
    console.error(`Ошибка при отмене назначения команды ${teamId} на кейс ${caseId}:`, error);
    throw error;
  }
};

/**
 * Добавляет ссылку к кейсу
 * @param caseId ID кейса
 * @param linkId ID ссылки
 * @returns Обновленный кейс
 */
export const addLinkToCase = async (caseId: string, linkId: string): Promise<Case> => {
  try {
    // Получаем текущий кейс
    const currentCase = await getCaseById(caseId);
    if (!currentCase) {
      throw new Error(`Кейс с ID ${caseId} не найден`);
    }

    // Добавляем ссылку, если она еще не добавлена
    const linkIds = [...(currentCase.linkIds || [])];
    if (!linkIds.includes(linkId)) {
      linkIds.push(linkId);
    }

    // Обновляем кейс
    const records = await api(TABLES.CASES).update([
      {
        id: caseId,
        fields: {
          "Links": linkIds
        }
      }
    ]);

    const record = records[0];
    return {
      id: record.id,
      number: record.fields["ID"] as number,
      name: record.fields["Название"] as string,
      description: record.fields["Описание"] as string,
      resultsUploadInfo: record.fields["Результаты для загрузки"] as string,
      deadline: record.fields["Дедлайн отправки"] as string,
      hackathonIds: record.fields["Хакатон"] as string[] || [],
      teamIds: record.fields["Команды"] as string[] || [],
      linkIds: record.fields["Links"] as string[] || []
    };
  } catch (error) {
    console.error(`Ошибка при добавлении ссылки ${linkId} к кейсу ${caseId}:`, error);
    throw error;
  }
};

/**
 * Удаляет ссылку из кейса
 * @param caseId ID кейса
 * @param linkId ID ссылки
 * @returns Обновленный кейс
 */
export const removeLinkFromCase = async (caseId: string, linkId: string): Promise<Case> => {
  try {
    // Получаем текущий кейс
    const currentCase = await getCaseById(caseId);
    if (!currentCase) {
      throw new Error(`Кейс с ID ${caseId} не найден`);
    }

    // Удаляем ссылку из списка
    const linkIds = (currentCase.linkIds || []).filter(id => id !== linkId);

    // Обновляем кейс
    const records = await api(TABLES.CASES).update([
      {
        id: caseId,
        fields: {
          "Links": linkIds
        }
      }
    ]);

    const record = records[0];
    return {
      id: record.id,
      number: record.fields["ID"] as number,
      name: record.fields["Название"] as string,
      description: record.fields["Описание"] as string,
      resultsUploadInfo: record.fields["Результаты для загрузки"] as string,
      deadline: record.fields["Дедлайн отправки"] as string,
      hackathonIds: record.fields["Хакатон"] as string[] || [],
      teamIds: record.fields["Команды"] as string[] || [],
      linkIds: record.fields["Links"] as string[] || []
    };
  } catch (error) {
    console.error(`Ошибка при удалении ссылки ${linkId} из кейса ${caseId}:`, error);
    throw error;
  }
};