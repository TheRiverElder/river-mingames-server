import { double } from "../CommonTypes";
import RandomAdapter from "./RandomAdapter";

export default class NativeRandom extends RandomAdapter {

    override next(): double {
        return Math.random();
    }
    
}