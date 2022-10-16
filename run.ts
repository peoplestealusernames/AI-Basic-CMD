import { readFileSync } from "fs"
import { format } from "util"
import { input, AgentClass, rawInput, SessionClass } from "./classes"
import { Evolve } from "./evolve"
import { init } from "./init"
import { RandomIndex } from "./misc"
import { GetAgentScores } from "./simulate"

const rawData: rawInput[] = JSON.parse(readFileSync("./input.json", { encoding: "utf-8" }))

const Delta = 0.1

const AgentAmount = 100
// Layers is count
// Amount in layers is element
const HiddenLayers = [10]

const session = new SessionClass(rawData, HiddenLayers, AgentAmount, Delta)

let runs = 1

//Runtime
setInterval(() => {
    //Simulate
    const results = GetAgentScores(session)

    //Output and sort
    //TODO: % correct
    results.sort((a, b) => b.score - a.score)
    console.log(`Gen: ${runs} Best score:${results[0].score} Total Correct:${results.filter(e => e.score > .5).length}`)
    runs++

    //Decend
    session.Agents = Evolve(session, results)
}, 100)
