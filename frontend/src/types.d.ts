type Column = {
    name: string;
    type: string;
    nullable: boolean;
}

type TableSchema = {
    name: string;
    columns: Column[];
}

type SchemaResponse = {
    tables: TableSchema[];
}

type TablesResponse = {
    tables: { name: string }[];
}

type TableDataResponse = {
    columns: Column[];
    rows: Row[];
    totalRows: number;
}

type ErrorResponse = {
    error: string;
}

type RowValue = string | number | boolean | null | Row | RowValue[];

type Row = {
    [key: string]: RowValue;
};

type QueryResponse = {
    rows: Row[];
};
