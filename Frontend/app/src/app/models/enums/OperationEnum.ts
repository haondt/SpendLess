class Operation {
    id: Number;
    str: string;
}

const Operations: Operation[] = [
    { id: 0, str: "is not empty"},
    { id: 1, str: "is empty"},
    { id: 2, str: "is"},
    { id: 3, str: "matches regular expression"},
]

export {
    Operation,
    Operations
}