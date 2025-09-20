/**
 * ListItem is an interface for a single item in the report cards
 *
 * title: the title of the item
 * count: the count of the item
 */
export interface ListItem {
    title: string;
    count: number;
    value : string;
    formatedCount?: string;
}

/**
 * ChartDataItem is an interface for a single item in the chart data
 *
 * value: the value of the item
 * color: the color of the item
 */
export interface ChartDataItem {
    value: number;
    color: string;
}


export type dropDownItems = {
    label : string;
    value: string;
    color: string;
}

/**
 * DropdownProps is an interface for the props of the Dropdown component
 *
 * items: an array of strings to display in the dropdown
 * placeholder: the text to display when no item is selected
 * selectedValue: the currently selected item
 * onValueChange: called when the user selects an item from the dropdown
 * label: an optional label to display above the dropdown
 */
export interface DropdownProps {
    items: dropDownItems[];
    placeholder: string;
    selectedValue: dropDownItems | null;
    onValueChange: (value: dropDownItems) => void;
    label?: string;
}


export type AuditStatus  = "PENDING" | "IN_PROGRESS" | "COMPLETED"
