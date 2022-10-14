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

class AgentClass {
    BiasTable: number[][]
    constructor(BiasTable: number[][]) {
        this.BiasTable = BiasTable
    }
}

let Agents: AgentClass[] = []

//Init agents
for (let a = 0; a < AgentAmount; a++) {
    const BiasTable: number[][] = []

    for (let i = 0; i < Inputs; i++) {
        BiasTable[i] = [];
        for (let k = 0; k < Outputs.length; k++)
            BiasTable[i][k] = Math.random() * 100; //TODO: Revisit
    }
    Agents.push(new AgentClass(BiasTable))
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
    const out: number[] = []
    for (let i = 0; i < Agent.BiasTable.length; i++) {
        for (let b = 0; b < Agent.BiasTable[i].length; b++) {
            out[b] = Input[i] * Agent.BiasTable[i][b]
        }
    }
    return out
}

//Decend
function Evolve(results: { score: number, agent: AgentClass }[]) {
    //TODO: better evolve system
    //Its already sorted by runtime otherwise max would need to be grabbed
    const best = results[0].agent
    const Agents: AgentClass[] = [best]
    for (let i = 1; i < AgentAmount; i++) {
        const BiasTable = best.BiasTable.map(e => e.map(e => e))
        const randomi = RandomIndex(BiasTable)
        const randomk = RandomIndex(BiasTable[randomi])
        BiasTable[randomi][randomk] += (Math.random() * 2 - 1) * Delta
        Agents[i] = new AgentClass(BiasTable)
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