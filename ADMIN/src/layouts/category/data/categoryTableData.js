export default function data() {
    return {
        columns: [
            {
                Header: "id",
                accessor: "id",
                align: "left",
                width: "5%"
            },
            {
                Header: "image",
                accessor: "image",
                align: "left",
                width: "5%",
            },
            {
                Header: "title",
                accessor: "title",
                align: "left",
                // width: "45%"
            },
            {
                Header: "account types",
                accessor: "accountTypes",
                align: "left",
                // width: "40%"
            },
            {
                Header: "action",
                accessor: "action",
                align: "left",
                width: "5%"
            },
        ]


    };
}
