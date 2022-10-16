import { AgentClass, input, scoreClass } from "./classes"
import { Evolve } from "./evolution"
import { GetAgentScores } from "./Simulator"

export function init(AgentAmount: i32, Layers: i32[]): AgentClass[] {
    const Agents: AgentClass[] = []

    //Init agents
    for (let a = 0; a < AgentAmount; a++) {
        const WeightTable: f64[][][] = []

        for (let layer = 0; layer < Layers.length - 1; layer++) {
            WeightTable[layer] = [];
            for (let i = 0; i < Layers[layer]; i++) {
                WeightTable[layer][i] = [];
                for (let o = 0; o < Layers[layer + 1]; o++)
                    WeightTable[layer][i][o] = Math.random() * 100; //TODO: Revisit
            }
        }

        Agents.push(new AgentClass(WeightTable))
    }

    return Agents
}

//Runtime
let runs = 1

export function Step(data: input[], Agents: AgentClass[], Layers: i32[], AgentAmount: i32, Delta: f64): AgentClass[] {
    //Simulate
    const results = GetAgentScores(Agents, data, Layers)

    //Output and sort
    //TODO: % correct
    results.sort((a: scoreClass, b: scoreClass) => (b.score - a.score) as i32)
    console.log(`Gen: ${runs} Best score:${results[0].score} Total Correct:${results.filter(e => e.score > .5).length}`)
    runs++

    //Decend
    return Evolve(AgentAmount, Delta, results)
}
