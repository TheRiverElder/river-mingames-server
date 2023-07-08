import City from "../City";
import { Eras, Resources } from "../Constants";
import Game from "../Game";
import Profile from "../Profile";
import Action from "./Action";

export default class Network implements Action {

    get name(): string { return "network"; }

    canUseCard(card: string, game: Game, profile: Profile) {
        return true;
    }

    act(args: any, game: Game, profile: Profile) {
        const cityUidLists: Array<Array<number>> = args.ends;
        const adjusentCities = new Set<City>();
        for (const cityUids of cityUidLists) {
            if (cityUids.length !== 2 || cityUids[0] === cityUids[1]) throw new Error(`Cannot network, cities must be exactly 2 different cities.`);
            const cities: Array<City> = cityUids.map(uid => game.cities.get(uid)!);
            cities.forEach(city => adjusentCities.add(city));
            const link = game.getLink(cities[0], cities[1]);
            if (!link) throw new Error(`Cannot network, link not exists.`);
            if (link.owner) throw new Error(`Cannot network, link already has an owner ${link.owner.name}.`);
            
            link.owner = profile;
        }

        // 消耗物资
        if (game.era === Eras.CANAL) {
            profile.money -= 3;
        } else if (game.era === Eras.RAIL) {
            if (cityUidLists.length === 1) {
                profile.money -= 5;
                const industrySlot = game.findResource(profile, Resources.COAL, true, Array.from(adjusentCities));
                if (!industrySlot) throw new Error(`Cannot network, resource ${Resources.COAL} not found or connected.`);
                industrySlot.factory!.resources![1]--;
            } else if (cityUidLists.length === 2) {
                profile.money -= 15;
                let restCoalAmount = 2;
                while (restCoalAmount > 0) {
                    const industrySlot = game.findResource(profile, Resources.COAL, true, Array.from(adjusentCities));
                    if (!industrySlot) throw new Error(`Cannot network, resource ${Resources.COAL} not found or connected.`);
                    const delta = Math.min(industrySlot.factory!.resources![1], restCoalAmount);
                    industrySlot.factory!.resources![1] -= delta;
                    restCoalAmount -= delta;
                }
            }
        }
        
    }
}