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
                width: "5%"
            },
            {
                Header: "name",
                accessor: "name",
                align: "left",
                width: "20%"

            },
            {
                Header: "category",
                accessor: "category",
                align: "left",
            },
       
            {
                Header: "access",
                accessor: "access",
                align: "left",
                width: "8%"
            },
            {
                Header: "Regional Relevance",
                accessor: "regional_relevance",
                align: "left",
                width: "8%"
            },
            {
                Header: "action",
                accessor: "action",
                align: "left",
                width: "9%"
            },
        ]
    };
}
