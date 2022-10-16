import { GPU } from "gpu.js/src";
import { AgentClass, input, SessionClass } from "./classes";
import { NormalizeArray, ArrayAvg } from "./misc";

//Simulator
export function GetAgentScores(session: SessionClass) {
    const scores = session.Agents.map(Agent => {
        return { score: GetAgentScore(session, Agent), agent: Agent }
    })

    return scores
}

export function GetAgentScore(session: SessionClass, Agent: AgentClass): number {
    //function (inputCount: number, nodes: number[][], Weights: number[][][]) {
    //y = node group; x = outnode;

    let nodes: number[][] = session.Data.map(e => e.input)

    for (let layer = 0; layer < session.Layers.length - 1; layer++) {
        nodes = simThread.setOutput([session.Layers[layer + 1], session.Data.length])
            (session.Layers[layer], nodes, Agent.WeightTable[layer]) as number[][]
    }



    const scores = nodes.map((output, i) => {
        //TODO: changeable score system
        const result = NormalizeArray(output)

        return result[session.Data[i].output]
    });
    return ArrayAvg(scores)
}

const gpu = new GPU({ mode: "gpu" })

const simThread = gpu.createKernel(function (inputCount: number, nodes: number[][], Weights: number[][]) {
    //y = node group; x = outnode;

    let sum = 0
    for (let i = 0; i < inputCount; i++)
        sum += nodes[this.thread.y][i] * Weights[i][this.thread.x]

    return sum
}).setDynamicOutput(true)
