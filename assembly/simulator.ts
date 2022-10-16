import { AgentClass, input, scoreClass } from "./classes";
import { NormalizeArray, ArrayAvg } from "./misc";

export function GetAgentScores(Agents: AgentClass[], data: input[], layers: i32[]): scoreClass[] {
    const scores: scoreClass[] = []
    for (let i = 0; i < Agents.length; i++) {
        const ret = new scoreClass()
        ret.score = GetAgentScore(Agents[i], data, layers)
        ret.agent = Agents[i]
        scores.push(ret)
    }

    return scores
}

export function GetAgentScore(Agent: AgentClass, data: input[], layers: i32[]): f64 {
    const scores: f64[] = []

    for (let i: i32 = 0; i < data.length; i++) {
        //TODO: changeable score system
        const result = NormalizeArray(RunSim(Agent, data[i].input, layers))

        scores.push(result[data[i].output])
    };
    return ArrayAvg(scores)
}

export function RunSim(Agent: AgentClass, Input: f64[], layers: i32[]): f64[] {
    const nodes: f64[][] = [Input]
    //Input.forEach(e => console.log(e.toString()))
    for (let layer = 0; layer < Agent.WeightTable.length; layer++) {
        nodes[layer + 1] = (new Array(layers[layer + 1]) as f64[]).fill(0)
        for (let i = 0; i < Agent.WeightTable[layer].length; i++)
            for (let w = 0; w < Agent.WeightTable[layer][i].length; w++) {
                nodes[layer + 1][w] += nodes[layer][i] * Agent.WeightTable[layer][i][w]
                //console.log(nodes[layer][i].toString())
            }
    }

    return nodes[nodes.length - 1]
}