import { isEmpty } from "../lang/Objects";
import { Nullable } from "../lang/Optional";
import Text from "./Text";

const REGEX = /\{\s*(\w+)\s*\}/g;

export default class I18n {

    resource: any;

    splitter: string = "、";

    constructor(resource?: any) {
        this.resource = resource;
    }

    getValue(key: string): Nullable<string> {
        return this.resource[key] || null;
    }

    get(key: string, args?: any): string {
        const value = this.getValue(key);
        if (!value) return key;
        if (isEmpty(args)) return value;

        return value.replace(REGEX, (match, key) => {
            let value = args[key];
            if (isEmpty(value)) return match;
            value = this.processValue(value);
            return (isEmpty(value)) ? match : value;
        });
    }

    private processValue(value: any): string {
        if (Array.isArray(value)) return value.map(e => this.processValue(e)).join(this.splitter);
        if (Object.hasOwn((value as any).__proto__, "process")) return (value as Text).process(this); 
        return value;
    }
    
}