import { readFileSync } from "fs"
import { rawInput, SessionClass } from "./classes"
import { Evolve } from "./evolve"
import { GetAgentScores } from "./simulate"

// Location of data file
// format should be: {
//   output: string
//   input: number[]
// }
const dataFile = "./input.json"

// How many entries of data will be in 1 training batch
// This effects how much data is sent to the gpu for training
const dataBatch = 10240

// Max change in bias / weight
const Delta = 0.1

// Amount of AI agents training at once
const AgentAmount = 100

// Layers is count
// Amount in layers is element
const HiddenLayers: number[] = [10]

//TODO: data streaming
//Grab the raw data from the json
const rawData: rawInput[] = JSON.parse(readFileSync(dataFile, { encoding: "utf-8" }))
//Training session class
const session = new SessionClass(rawData, HiddenLayers, AgentAmount, Delta, dataBatch)

// run counter for console log
let runs = 1

//Runtime
setInterval(() => {
    // Simulate
    const results = GetAgentScores(session)

    // Output and sort
    results.sort((a, b) => b.score - a.score)
    console.log(`Gen: ${runs} Best score:${results[0].score} Total Correct:${results.filter(e => e.score > .5).length}`)
    runs++

    // Decend / evolve
    session.Agents = Evolve(session, results)
}, 100)
