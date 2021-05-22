type Environments = {
    lineToken: string;
};

const properties = PropertiesService.getScriptProperties();

const appEnvironments: Environments = {
    lineToken: properties.getProperty('LINE_TOKEN'),
};

const intervalMinute = 60 * 24 * 7; // 1week

const fetchMessages = (): GoogleAppsScript.Gmail.GmailMessage[][] => {
    const currentTime = Math.floor(new Date().getTime() / 1000);
    const timeTerm = currentTime - 60 * intervalMinute;
    const query = `is:unread in:inbox after:${timeTerm}`;

    const threads = GmailApp.search(query);
    const messages = GmailApp.getMessagesForThreads(threads);
    return messages;
};

const generateMailSummary = (
    originalMessages: GoogleAppsScript.Gmail.GmailMessage[][],
): string[] => {
    let currentIndex = 0;
    return originalMessages.reduce((current, messages, i) => {
        const unradMessages = messages.filter((m) => m.isUnread());
        const threadSummary = generateThreadSummary(
            currentIndex,
            unradMessages,
        );
        currentIndex += threadSummary.length;
        return current.concat(threadSummary);
    }, [] as string[]);
};

const generateThreadSummary = (
    parent: number,
    thread: GoogleAppsScript.Gmail.GmailMessage[],
): string[] => {
    return thread.map((m, i) => {
        const date = m.getDate();
        const dateStr = `${
            date.getMonth() + 1
        }/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
        const subject = m.getSubject();
        const index = parent + i + 1;
        return `${index}. ${subject} [${dateStr}]`;
    });
};

const generateNotifyMessage = (mailSummary: string[]): string => {
    if (!mailSummary.length) {
        return '\n未読メールはありません☀️';
    }
    const summaryStr = mailSummary.join('\n');
    return `\n未読メールが${mailSummary.length}件あります。\n${summaryStr}`;
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
    const notifyMessage = generateNotifyMessage(mailSummary);
    sendToLine(notifyMessage);
}
