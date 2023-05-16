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
                Header: "Image",
                accessor: "image",
                align: "left",
                width: "5%"
            },
            {
                Header: "Topic",
                accessor: "topic",
                align: "left",
                width: "20%"
            },
            {
                Header: "Question",
                accessor: "question",
                align: "left",
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
