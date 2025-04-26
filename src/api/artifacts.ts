import { api, TABLES } from "./airtableClient";
import { v4 as uuidv4 } from 'uuid';
// Import a browser-compatible S3 client instead
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
const region = "ru-central1"; // Yandex Cloud region

// Create a browser-compatible S3 client
const s3Client = new S3Client({
    region,
    endpoint: "https://storage.yandexcloud.net",
    credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    },
});


// Интерфейс для артефакта
interface ArtifactData {
    teamId: string;
    name: string;
    file: File;
}

/**
 * Загружает файл в S3 и создает запись в Airtable
 * @param artifactData - данные артефакта (команда, название, файл)
 * @returns - информация о созданном артефакте
 */
export const uploadArtifact = async (artifactData: ArtifactData) => {
    try {
        // Generate unique filename
        const fileExtension = artifactData.file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;

        // Get file content as ArrayBuffer
        const fileBuffer = await artifactData.file.arrayBuffer();

        // Upload to S3 using AWS SDK
        await s3Client.send(
            new PutObjectCommand({
                Bucket: bucketName,
                Key: fileName,
                Body: new Uint8Array(fileBuffer),
                ContentType: artifactData.file.type,
            })
        );

        // Form file URL
        const fileUrl = `https://${bucketName}.storage.yandexcloud.net/${fileName}`;

        const team = await api(TABLES.TEAMS)
            .select({
                filterByFormula: `{ID} = "${artifactData.teamId}"`,
                maxRecords: 1
            })
            .firstPage();

        // Create Airtable record
        const record = await api(TABLES.ARTIFACTS).create([
            {
                fields: {
                    "Команда ID": [team[0].id],
                    "Название": artifactData.name,
                    "Ссылка": fileUrl
                }
            }
        ]);

        // Return created artifact info
        return {
            id: record[0].id,
            teamId: artifactData.teamId,
            name: artifactData.name,
            fileUrl: fileUrl,
            createdAt: new Date().toISOString()
        };
    } catch (error) {
        console.error("Ошибка при загрузке артефакта:", error);
        throw error;
    }
};

/**
 * Получает список артефактов команды
 * @param teamId - ID команды
 * @returns - список артефактов команды
 */
export const getTeamArtifacts = async (teamId: string) => {
    try {
        const records = await api(TABLES.ARTIFACTS)
            .select({
                filterByFormula: `FIND("${teamId}", {Команда ID})`,
                sort: [{ field: "Дата создания", direction: "desc" }]
            })
            .firstPage();

        return records.map(record => ({
            id: record.id,
            teamId,
            name: record.fields["Название"] as string,
            fileUrl: record.fields["Ссылка"] as string,
            createdAt: record.fields["Дата создания"] as string
        }));
    } catch (error) {
        console.error("Ошибка при получении артефактов команды:", error);
        throw error;
    }
};

/**
 * Удаляет артефакт из S3 и Airtable
 * @param artifactId - ID артефакта в Airtable
 * @param fileUrl - URL файла в S3
 * @returns - результат удаления
 */
export const deleteArtifact = async (artifactId: string, fileUrl: string) => {
    try {
        // Extract filename from URL
        const fileName = fileUrl.split('/').pop();

        // Delete file from S3
        await s3Client.send(
            new DeleteObjectCommand({
                Bucket: bucketName,
                Key: fileName as string
            })
        );

        // Delete record from Airtable
        await api(TABLES.ARTIFACTS).destroy([artifactId]);

        return { success: true };
    } catch (error) {
        console.error("Ошибка при удалении артефакта:", error);
        throw error;
    }
};