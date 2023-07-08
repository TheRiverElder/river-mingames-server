import I18n from "./I18n";
import Text from "./Text";

export default class PlainText implements Text {

    readonly content: string;

    constructor(content: string) {
        this.content = content;
    }

    process(i18n: I18n): string {
        return this.content;
    }
}