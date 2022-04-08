class Operation {
    id: Number;
    viewValue: string;
}

const Operations: { [key: string]: { id: number, viewValue: string } } = {
    isNotEmpty: { id: 0, viewValue: "is not empty"},
    isEmpty: {id: 1, viewValue: "is empty"},
    is: { id: 2, viewValue: "is"},
    matchesRegularExpression: { id: 3, viewValue: "matches regular expression"},
}

export {
    Operation,
    Operations
}