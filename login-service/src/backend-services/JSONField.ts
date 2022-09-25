export interface JSONField {
    name: string;
    value?: object;
}

export function objectToJsonFieldArray(data: object): JSONField[] {
    const array: JSONField[] = [];
    for (const name in data) {
        if (Object.prototype.hasOwnProperty.call(data, name)) {
            const value = data[name];
            array.push({ name, value });
        }
    }
    return array;
}

export function jsonFieldArrayToObject(array: JSONField[]): object {
    const data = {};
    for (const field of array) {
        if (field.value) {
            data[field.name] = field.value;
        }
    }
    return data;
}
