import { AgentClass, input, SessionClass } from "./classes";
import { NormalizeArray, ArrayAvg } from "./misc";

//Simulator
export function GetAgentScores(session: SessionClass) {
    const scores = session.Agents.map(Agent => { return { score: GetAgentScore(Agent, session.Data), agent: Agent } })

    return scores
}

export function GetAgentScore(Agent: AgentClass, data: input[]): number {
    const scores = data.map(state => {
        //TODO: changeable score system
        const result = NormalizeArray(RunSim(Agent, state.input))

        return result[state.output]
    });
    return ArrayAvg(scores)
}

export function RunSim(Agent: AgentClass, Input: number[]) {
    const nodes: number[][] = [Input]
    for (let layer = 0; layer < Agent.WeightTable.length; layer++) {
        nodes[layer + 1] = Array(Agent.WeightTable[layer][0].length).fill(0)
        for (let i = 0; i < Agent.WeightTable[layer].length; i++)
            for (let w = 0; w < Agent.WeightTable[layer][i].length; w++)
                nodes[layer + 1][w] += nodes[layer][i] * Agent.WeightTable[layer][i][w]
    }

    return nodes[nodes.length - 1]
}