import City from "../City";
import { CitySlotData } from "../communication/GameStaticData";
import Game from "../Game";
import IndustrySlot from "../IndustrySlot";
import MerchantSlot from "../MerchantSlot";

function handleCitySlotData(raw: string, game: Game): [Array<IndustrySlot>, Array<MerchantSlot>, Array<CitySlotData>] {
    const industrySlots: Array<IndustrySlot> = [];
    const merchantSlots: Array<IndustrySlot> = [];
    const citySlotsData: Array<CitySlotData> = [];

    const table = raw.trim().split("\n").map(line => line.split("\t"));
    for (const [uidString, cityName, type, indexString, xString, yString] of table) {
        const uid = parseInt(uidString);
        const index = parseInt(indexString);
        const x = parseFloat(xString);
        const y = parseFloat(yString);

        const city: City = game.cities.getOrThrow(cityName);

        citySlotsData.push([]);

        switch (type) {
            case "industry": {
                break;
            } 
            case "merchant": {
                merchantSlots.push(new MerchantSlot(uid, city, ));
                break;
            }
        }
    }
}