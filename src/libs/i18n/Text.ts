import I18n from "./I18n";

export default interface Text {
    process(i18n: I18n): string;
}