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

const generateNotifyMessage = (mailSummary: string[]): string => {
    const summaryStr = mailSummary.join('\n');
    return `未読メールがあります。\n${summaryStr}`;
};

const sendToLine = (message: string) => {
    const payload = { message };
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
        method: 'post',
        payload,
        headers: { Authorization: `Bearer ${appEnvironments.lineToken}` },
    };
    UrlFetchApp.fetch('https://notify-api.line.me/api/notify', options);
};

function main() {
    const messages = fetchMessages();
    const mailSummary = generateMailSummary(messages);
    if (!mailSummary.length) return;

    const notifyMessage = generateNotifyMessage(mailSummary);
    sendToLine(notifyMessage);
}
