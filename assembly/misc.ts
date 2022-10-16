export function NormalizeArray(arr: f64[]): f64[] {
    let largest: f64 = arr[0]

    for (let i = 0; i < arr.length; i++)
        if (arr[i] > largest)
            largest = arr[i]

    if (largest === 0)
        return arr.map((): f64 => 0)

    for (let i = 0; i < arr.length; i++)
        arr[i] /= largest

    return arr
}

export function ArrayAvg(arr: f64[]): f64 {
    let sum: f64 = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i]
    }

    return (sum / arr.length)
}