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

export class SessionClass {
    Agents: AgentClass[]
    AgentAmount: number
    Data: input[]
    Layers: number[]
    Delta: number

    constructor(rawData: rawInput[], HiddenLayers: number[], AgentAmount: number, Delta: number) {
        this.AgentAmount = AgentAmount
        this.Delta = Delta

        const Unpack = init(rawData, HiddenLayers, AgentAmount)
        this.Data = Unpack[0]
        this.Agents = Unpack[1]
        this.Layers = Unpack[2]
    }
}