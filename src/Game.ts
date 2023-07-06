import City from "./City";
import IndustrySlot from "./IndustrySlot";
import Link from "./Link";
import Profile from "./Profile";
import Action from "./action/Action";
import { Nullable } from "./lang";

export default class Game {
    profiles = new Map<number, Profile>(); 
    era: string = "canal";
    cities = new Map<number, City>();
    links: Array<Link> = [];
    actions = new Map<string, Action>();

    private uidCounter = 0;

    genUid() {
        return this.uidCounter++;
    }

    getLink(end1: City, end2: City): Nullable<Link> {
        return this.links.find(link => link.isLinkOf(end1, end2)) || null;
    }

    getLinksOf(city: City): Array<Link> {
        return this.links.filter(link => link.connectedCity(city));
    }
    
    findResource(profile: Profile, resouceType: string, doMatchesOwner: boolean, adjusentCities: Array<City> = []): Nullable<IndustrySlot> {
        if (adjusentCities.length === 0) {
            return Array.from(this.cities.values())
                .flatMap(city => city.industrySlots)
                .find(slot => slot.factory 
                    && slot.factory.owner === profile 
                    && slot.factory.resources?.[0] === resouceType
                    && slot.factory.resources[1] > 0) 
                || null;
        }

        for (const city of adjusentCities) {
            const visitedCities = new Set<City>([city]);
            const queue: Array<City> = [city];

            while (queue.length > 0) {
                const city = queue.shift()!;

                const slot = city.getIndustrySlotWithResource(resouceType, doMatchesOwner ? profile : null);
                if (slot) return slot;

                const nextCities = this.getLinksOf(city)
                    .map(link => link.getOtherEnd(city))
                    .filter(city => city.isInNetworkOf(profile))
                    .filter(city => !visitedCities.has(city));
                queue.push(...nextCities);
            }
        }

        return null;
    }

    getCityByNmae(name: string): Nullable<City> {
        return Array.from(this.cities.values()).find(city => city.name === name) || null;
    }
}