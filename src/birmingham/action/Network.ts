import { int, Pair } from "../../libs/CommonTypes";
import City from "../City";
import { Eras, Resources } from "../Constants";
import Game from "../Game";
import IndustrySlot from "../IndustrySlot";
import Profile from "../Profile";
import Action from "./Action";

export default class Network implements Action {

    get name(): string { return "network"; }

    canUseCard(card: string, game: Game, profile: Profile) {
        return true;
    }

    act(args: any, game: Game, profile: Profile) {
        const links = (args.links as Array<int>).map(uid => game.links.getOrThrow(uid));

        for (const link of links) {
            if (link.owner) throw new Error(`该段网路已有主人：${link.owner.name}.`);
            let canBuild = false;
            if (!profile.hasNetWork(game)) {
                canBuild = true;
            } else {
                for (const city of link.getEnds()) {
                    if (city.hasFactoryOf(profile) || game.getLinksOf(city).some(nl => nl.owner === profile)) {
                        canBuild = true;
                        break;
                    }
                }
            }
            if (!canBuild) throw new Error(`该段网路没有连接到*自己*的网络（建有自己工厂的城市活自己在建造的网路）`);
            link.owner = profile;
        }

        // 消耗物资
        if (game.era === Eras.CANAL) {
            profile.pay(Resources.COIN, 3);
        } else if (game.era === Eras.RAIL) {
            const resourceSourcesData: Array<Pair<string, Array<int>>> = args.resourceSources;
            const resourceSources = new Map<string, Array<IndustrySlot>>(resourceSourcesData.map(([type, sourceUidList]) => 
                [type, sourceUidList.map(it => game.industrySlots.getOrThrow(it))]));

            if (links.length === 1) {
                profile.pay(Resources.COIN, 5);
                const coalSources = resourceSources.get(Resources.COAL);
                if (!coalSources || coalSources.length === 0) throw new Error(`未提供煤炭来源`);
                const coalMine = coalSources[0].factory;
                if (
                    !coalMine 
                    || !coalMine.resources 
                    || coalMine.resources[0] !== Resources.COAL 
                    || coalMine.resources[1] < 1
                ) throw new Error(`提供的煤炭来源没有足够的煤炭`);

                coalMine.resources[1] -= 1;
            } else if (links.length === 2) {
                profile.pay(Resources.COIN, 15);
                
                const coalSources = resourceSources.get(Resources.COAL);
                if (!coalSources) throw new Error(`未提供煤炭来源`);
                for (const coalSource of coalSources) {
                    const coalMine = coalSource.factory;
                    if (
                        !coalMine 
                        || !coalMine.resources 
                        || coalMine.resources[0] !== Resources.COAL 
                        || coalMine.resources[1] < 1
                    ) throw new Error(`提供的煤炭来源没有足够的煤炭`);      

                    coalMine.resources[1] -= 1;         
                }

                const beerSources = resourceSources.get(Resources.BEER);
                if (!beerSources) throw new Error(`未提供啤酒来源`);
                {
                    const brewery = beerSources[0].factory;
                    if (
                        !brewery 
                        || !brewery.resources 
                        || brewery.resources[0] !== Resources.BEER 
                        || brewery.resources[1] < 1
                    ) throw new Error(`提供的啤酒来源没有足够的啤酒`);   

                    brewery.resources[1] -= 1;  
                }
            }
        }
        
    }
}