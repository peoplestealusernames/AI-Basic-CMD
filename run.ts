import { readFileSync } from "fs"
import { format } from "util"

type input = {
    output: string
    input: number[]
}

function IndexOutputs(data: input[]) {
    const output = data.map(e => e.output)
    return output.filter((e, i) => output.indexOf(e) === i)
}

function CheckInputs(data: input[]) {
    const length = data[0].input.length
    if (!length)
        throw new Error(format("No input given on input 1:", data[0]))

    const outliers = data.filter(e => e.input.length !== length)
    if (outliers.length > 0)
        throw new Error(format(`Input lengths did not match data set 1 (l=${length}):`, outliers))

    return length
}

const data: input[] = JSON.parse(readFileSync("./input.json", { encoding: "utf-8" }))

const Inputs = CheckInputs(data)
const Outputs = IndexOutputs(data)
const OutHash: { [key: string]: number } = {}
Outputs.forEach((e, i) => OutHash[e] = i)

const Delta = 0.1

const AgentAmount = 100
// Layers is count
// Amount in layers is element
const HiddenLayers = [10]

const Layers = [Inputs, ...HiddenLayers, Outputs.length]

class AgentClass {
    //Layer, Node, Weight
    WeightTable: number[][][]

    constructor(WeightTable: number[][][]) {
        this.WeightTable = WeightTable
    }
}

let Agents: AgentClass[] = []

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

let runs = 1

//Runtime
setInterval(() => {
    //Simulate
    const results = GetAgentScores(Agents)

    //Output and sort
    //TODO: % correct
    results.sort((a, b) => b.score - a.score)
    console.log(`Gen: ${runs} Best score:${results[0].score} Total Correct:${results.filter(e => e.score > .5).length}`)
    runs++

    //Decend
    Agents = Evolve(results)
}, 100)


//Simulator
function GetAgentScores(Agents: AgentClass[]) {
    const scores = Agents.map(Agent => { return { score: GetAgentScore(Agent), agent: Agent } })

    return scores
}

function GetAgentScore(Agent: AgentClass): number {
    const scores = data.map(state => {
        //TODO: changeable score system
        const result = NormalizeArray(RunSim(Agent, state.input))
        const index = OutHash[state.output] //index of correct result

        return result[index]
    });
    return ArrayAvg(scores)
}

function RunSim(Agent: AgentClass, Input: number[]) {
    const nodes: number[][] = [Input]
    for (let layer = 0; layer < Agent.WeightTable.length; layer++) {
        nodes[layer + 1] = []

        for (let i = 0; i < Agent.WeightTable[layer].length; i++) {
            for (let w = 0; w < Agent.WeightTable[layer][i].length; w++) {
                if (!nodes[layer + 1][w])
                    nodes[layer + 1][w] = 0
                nodes[layer + 1][w] += nodes[layer][i] * Agent.WeightTable[layer][i][w]
            }
        }
    }

    return nodes[nodes.length - 1]
}

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

//MISC
function RandomIndex(arr: any[]) {
    return Math.floor(Math.random() * arr.length)
}

function NormalizeArray(arr: number[]) {
    let max = arr[0]
    for (const n of arr)
        if (n > max)
            max = n

    if (max === 0)
        return arr.map(() => 0)
    return arr.map(e => e / max)
}

function ArrayAvg(arr: number[]) {
    let sum = 0;
    for (const n of arr)
        sum += n

    return (sum / arr.length)
}