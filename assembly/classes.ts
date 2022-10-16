

export class AgentClass {
    //Layer, Node, Weight
    WeightTable: f64[][][]

    constructor(WeightTable: f64[][][]) {
        this.WeightTable = WeightTable
    }
}

export class input {
    output!: i32
    input!: f64[]
}

export class scoreClass {
    score: f64 = 0
    agent!: AgentClass
}