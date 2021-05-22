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

function main() {}
