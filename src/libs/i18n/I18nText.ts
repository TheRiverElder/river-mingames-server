import { Nullable } from "../lang/Optional";
import I18n from "./I18n";
import Text from "./Text";

export default class I18nText implements Text {

    readonly key: string;
    readonly args: Nullable<any>;

    constructor(key: string, args?: any) {
        this.key = key;
        this.args = args || null;
    }

    process(i18n: I18n): string {
        return i18n.get(this.key, this.args);
    }
}