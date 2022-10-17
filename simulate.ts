import { GPU } from "gpu.js/src";
import { AgentClass, input, SessionClass } from "./classes";
import { NormalizeArray, ArrayAvg } from "./misc";

//Simulator
export function GetAgentScores(session: SessionClass) {

    // Agent, node data group, node 
    let nodes: number[][][] = session.Agents.map(e => session.Data.map(e => e.input))

    for (let layer = 0; layer < session.Layers.length - 1; layer++) {
        // Agent, input node, output node
        const Weights: number[][][] = session.Agents.map(e => e.WeightTable[layer]);
        for (let section = 0; section < session.Data.length; section += session.DataBatch) {
            const remainer = session.Data.length - section;
            const sectionLength = remainer < session.DataBatch ? remainer : session.DataBatch;

            (simThread
                .setOutput([
                    session.Layers[layer + 1],
                    sectionLength,
                    session.Agents.length
                ])(
                    session.Layers[layer],
                    nodes.map(e => e.slice(section, sectionLength + section)),
                    Weights
                ) as number[][][]).forEach((e, agenti) => e.forEach((e, i) => { nodes[agenti][i + section] = e }))
        }
    }

    const scores = nodes.map((e, agentI) => {
        const scores = e.map((output, i) => {
            //TODO: changeable score system
            const result = NormalizeArray(output)

            return result[session.Data[i].output]
        });
        return { score: ArrayAvg(scores), agent: session.Agents[agentI] }
    })

    return scores
}

const gpu = new GPU({ mode: "gpu" })

const simThread = gpu.createKernel(function (inputCount: number, nodes: number[][][], Weights: number[][][]) {
    //z = agent; y = node group; x = outnode;

    let sum = 0
    for (let i = 0; i < inputCount; i++)
        sum += nodes[this.thread.z][this.thread.y][i] * Weights[this.thread.z][i][this.thread.x]

    return sum
}).setDynamicOutput(true).setDynamicArguments(true)
