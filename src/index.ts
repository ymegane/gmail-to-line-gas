type Environments = {
    lineToken: string;
};

const properties = PropertiesService.getScriptProperties();

const appEnvironments: Environments = {
    lineToken: properties.getProperty('LINE_TOKEN'),
};

const intervalMinute = 60; // 1時間

const fetchMessages = (): GoogleAppsScript.Gmail.GmailMessage[][] => {
    const currentTime = Math.floor(new Date().getTime() / 1000);
    const timeTerm = currentTime - 60 * intervalMinute;
    const query = `is:unread after:${timeTerm}`;

    const threads = GmailApp.search(query);
    const messages = GmailApp.getMessagesForThreads(threads);
    return messages;
};

const generateMailSummary = (
    originalMessages: GoogleAppsScript.Gmail.GmailMessage[][],
): string[] => {
    return originalMessages.map((m, i) => {
        const firstMessage = m[0];
        const date = firstMessage.getDate();
        const dateStr = `${date.getMonth()} / ${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
        const subject = firstMessage.getSubject();
        return `${i}. ${subject} [${dateStr}]`;
    });
};

function main() {}
