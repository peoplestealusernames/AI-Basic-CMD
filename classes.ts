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