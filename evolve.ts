import { AgentClass, SessionClass } from "./classes"
import { RandomIndex } from "./misc"

//Decend
export function Evolve(session: SessionClass, results: { score: number, agent: AgentClass }[]) {
    //TODO: better evolve system
    //Its already sorted by runtime otherwise max would need to be grabbed
    const best = results[0].agent
    const Agents: AgentClass[] = [best]
    for (let i = 1; i < results.length; i++) {
        //Unpack the array to prevent refrenced based editing
        const WeightTable = best.WeightTable.map(e => e.map(e => e.map(e => e)))
        const randoml = RandomIndex(WeightTable)
        const randomi = RandomIndex(WeightTable[randoml])
        const randomw = RandomIndex(WeightTable[randoml][randomi])
        WeightTable[randoml][randomi][randomw] += (Math.random() * 2 - 1) * session.Delta
        Agents[i] = new AgentClass(WeightTable)
    }
    return Agents
}
