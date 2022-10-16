import { init } from "./init"

export type rawInput = {
    output: string
    input: number[]
}

export type input = {
    output: number
    input: number[]
}

export class AgentClass {
    //Layer, Node, Weight
    WeightTable: number[][][]

    constructor(WeightTable: number[][][]) {
        this.WeightTable = WeightTable
    }
}

export type results = {
    score: number;
    agent: AgentClass;
}

export class SessionClass {
    Agents: AgentClass[]
    AgentAmount: number
    Data: input[]
    Layers: number[]
    Delta: number
    DataBatch: number

    constructor(rawData: rawInput[], HiddenLayers: number[], AgentAmount: number, Delta: number, DataBatch: number) {
        this.AgentAmount = AgentAmount
        this.Delta = Delta
        this.DataBatch = DataBatch

        const Unpack = init(rawData, HiddenLayers, AgentAmount)
        this.Data = Unpack[0]
        this.Agents = Unpack[1]
        this.Layers = Unpack[2]
    }
}