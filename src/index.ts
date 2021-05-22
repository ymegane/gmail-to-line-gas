type Environments = {
    lineToken: string;
};

const properties = PropertiesService.getScriptProperties();

const appEnvironments: Environments = {
    lineToken: properties.getProperty('LINE_TOKEN'),
};

function main() {}
