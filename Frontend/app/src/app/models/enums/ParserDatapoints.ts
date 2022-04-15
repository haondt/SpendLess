import { ViewEnum } from "./ViewEnum";

export const ParserDatapoints: { [key: string]: ViewEnum } = {
    vendor: { id: 0, viewValue: "Vendor" },
    value: { id: 1, viewValue: "Value" },
    date: { id: 2, viewValue: "Date" },
    recurring: { id: 3, viewValue: "Recurring" },
    category: { id: 4, viewValue: "Category" },
    description: { id: 6, viewValue: "Description" },
}