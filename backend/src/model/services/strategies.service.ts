import { Injectable } from "@nestjs/common";
import { Strategy } from "../../strategies/Strategy";

@Injectable()
export class StrategiesService {
    private readonly allStrategies: Map<string, Strategy> = new Map();

    public getStrategyByName(name: string): Strategy | null {
        return this.allStrategies.get(name) ?? null;
    }

    public hasStrategy(name: string): boolean {
        return this.allStrategies.has(name);
    }

    public addStrategy(name: string, strategy: Strategy) {
        if (this.allStrategies.has(name)) {
            throw new Error(`Strategy with name ${name} already exists`);
        }
        this.allStrategies.set(name, strategy);
    }

    public getAllStrategies(): Strategy[] {
        return [...this.allStrategies.values()];
    }
}
