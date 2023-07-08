export default class Track {
    points: number;

    constructor(points: number = 10) {
        this.points = points;
    }

    save(): any {
        return {
            points: this.points,
        };
    }
    
    static load(data: any): Track {
        return new Track(data.points);
    }

    climb(amount: number) {
        this.points += amount;
    }

    fall(amount: number) {
        const currentLevel = this.getIncomeLevel();
        const nextLevel = currentLevel - amount;
        let nextPoints = 0;
        
        if (nextLevel <= 0) nextPoints = (10 + nextLevel);
        else if (nextLevel <= 10) nextPoints = 10 + nextLevel * 2;
        else if (nextLevel <= 20) nextPoints = 30 + (nextLevel - 10) * 3;
        else nextPoints = 60 + (nextLevel - 20) * 4;
        
        this.points = Math.max(0, nextPoints);
    }

    getIncomeLevel(): number {
        if (this.points <= 10) return (this.points - 10);
        if (this.points <= 30) return Math.ceil((this.points - 10) / 2);
        if (this.points <= 60) return 10 + Math.ceil((this.points - 30) / 3);
        return 20 + Math.ceil((this.points - 60) / 4);
    }

    getGoal(): number {
        return this.points;
    }
}