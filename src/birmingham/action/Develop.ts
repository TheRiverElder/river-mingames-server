import FactorySlot from "../FactorySlot";
import Game from "../Game";
import Profile from "../Profile";
import Action from "./Action";

export default class Develop implements Action {

    canUseCard(card: string, game: Game, profile: Profile) {
        return true;
    }

    act(args: any, game: Game, profile: Profile) {
        const indystriesToDevelop: Array<string> = args.industries;
        if (indystriesToDevelop.length > 2) throw new Error("Cannot develop, can only develop at most two factories.");
        if (indystriesToDevelop.length <= 0) throw new Error("Cannot develop, must choose at lease at most 2 factories to develop.");

        // 对产业数量做计数
        const countedIndustries: Array<[string, number]> = [];
        for (const industry of indystriesToDevelop) {
            const record = countedIndustries.find(it => it[0] === industry) || [industry, 0];
            record[1]++;
        }

        // 检测是否存在足够的该产业的工厂牌
        const factorySlotLines: Array<[Array<FactorySlot>, number]> = [];
        for (const [industry, amount] of countedIndustries) {
            const factorySlotLine = profile.factories.find((factories) => factories[0] === industry)?.[1];
            if (factorySlotLine === undefined) throw new Error(`Cannot develop, factories of ${industry} not found.`);
            const factorySlot = factorySlotLine.find(slot => slot.amount > 0);
            let counter = 0;
            for (const slot of factorySlotLine) {
                if (slot.amount <= 0) continue;
                counter += Math.min(amount - counter, slot.amount);
                if (counter >= amount) break;
            }
            if (counter < amount) throw new Error(`Cannot develop, industry ${industry} does not has enough factories to develop.`);
            factorySlotLines.push([factorySlotLine, amount]);
        }

        // 正式执行研发，丢弃工厂
        for (const [line, amount] of factorySlotLines) {
            let counter = 0;
            for (const slot of line) {
                if (slot.amount <= 0) continue;
                const delta = Math.min(amount - counter, slot.amount);
                line.splice(line.length - amount, amount);
                counter += delta;
                if (counter >= amount) break;
            }
        }
    }
}