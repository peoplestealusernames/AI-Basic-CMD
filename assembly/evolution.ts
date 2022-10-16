import { AgentClass, scoreClass } from "./classes"

export function Evolve(AgentAmount: f64, Delta: f64, results: scoreClass[]): AgentClass[] {
    //TODO: better evolve system
    //Its already sorted by runtime otherwise max would need to be grabbed
    const best = results[0].agent
    const Agents: AgentClass[] = [best]
    for (let i = 1; i < AgentAmount; i++) {
        //Unpack the array to prevent refrenced based editing
        const WeightTable = best.WeightTable.map((e: f64[][]) => e.map((e: f64[]) => e.map((e: f64) => e)))
        const randoml = Math.floor(Math.random() * WeightTable.length) as i32
        const randomi = Math.floor(Math.random() * WeightTable[randoml].length) as i32
        const randomw = Math.floor(Math.random() * WeightTable[randoml][randomi].length) as i32
        WeightTable[randoml][randomi][randomw] += ((Math.random() * 2 - 1) * Delta)
        Agents[i] = new AgentClass(WeightTable)
    }
    return Agents
}
