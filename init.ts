import { format } from "util"
import { AgentClass, input, rawInput } from "./classes"

export function init(rawData: rawInput[], HiddenLayers: number[], AgentAmount: number): [
    data: input[],
    agents: AgentClass[],
    layers: number[]
] {
    const Inputs = CheckInputs(rawData)
    const Outputs = IndexOutputs(rawData)
    const OutHash: { [key: string]: number } = {}
    Outputs.forEach((e, i) => OutHash[e] = i)

    const newData: input[] = rawData.map((e) => { return { input: e.input, output: OutHash[e.output] } })

    const Layers = [Inputs, ...HiddenLayers, Outputs.length]

    const Agents = MakeAgents(Layers, AgentAmount)

    return [newData, Agents, Layers]
}

function MakeAgents(Layers: number[], AgentAmount: number) {
    const Agents: AgentClass[] = []
    //Init agents
    for (let a = 0; a < AgentAmount; a++) {
        const WeightTable: number[][][] = []

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

function IndexOutputs(data: rawInput[]) {
    const output = data.map(e => e.output)
    return output.filter((e, i) => output.indexOf(e) === i)
}

function CheckInputs(data: rawInput[]) {
    const length = data[0].input.length
    if (!length)
        throw new Error(format("No input given on input 1:", data[0]))

    const outliers = data.filter(e => e.input.length !== length)
    if (outliers.length > 0)
        throw new Error(format(`Input lengths did not match data set 1 (l=${length}):`, outliers))

    return length
}