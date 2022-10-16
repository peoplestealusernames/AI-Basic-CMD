import { readFileSync } from "fs"
import { format } from "util"
import { input, AgentClass, rawInput } from "./classes"
import { init } from "./init"
import { RandomIndex } from "./misc"
import { GetAgentScores } from "./simulate"

const rawData: rawInput[] = JSON.parse(readFileSync("./input.json", { encoding: "utf-8" }))

const Delta = 0.1

const AgentAmount = 100
// Layers is count
// Amount in layers is element
const HiddenLayers = [10]

const [data, Agents, Layers] = init(rawData, HiddenLayers, AgentAmount)

let runs = 1

//Runtime
setInterval(() => {
    //Simulate
    const results = GetAgentScores(data, Agents)

    //Output and sort
    //TODO: % correct
    results.sort((a, b) => b.score - a.score)
    console.log(`Gen: ${runs} Best score:${results[0].score} Total Correct:${results.filter(e => e.score > .5).length}`)
    runs++

    //Decend
    Evolve(results).map((e, i) => { Agents[i] = e })
}, 100)


//Decend
function Evolve(results: { score: number, agent: AgentClass }[]) {
    //TODO: better evolve system
    //Its already sorted by runtime otherwise max would need to be grabbed
    const best = results[0].agent
    const Agents: AgentClass[] = [best]
    for (let i = 1; i < AgentAmount; i++) {
        //Unpack the array to prevent refrenced based editing
        const WeightTable = best.WeightTable.map(e => e.map(e => e.map(e => e)))
        const randoml = RandomIndex(WeightTable)
        const randomi = RandomIndex(WeightTable[randoml])
        const randomw = RandomIndex(WeightTable[randoml][randomi])
        WeightTable[randoml][randomi][randomw] += (Math.random() * 2 - 1) * Delta
        Agents[i] = new AgentClass(WeightTable)
    }
    return Agents
}
