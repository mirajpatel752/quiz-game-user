import React, { useCallback, useMemo,  useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Avatar, Icon, IconButton } from '@mui/material';

function MyRenderer(params) {
  return (
    <Avatar
          src={`${
            params.data.image 
            === undefined ? "/broken-image.jpg" :  params.data.image 
          }`}
        />
  );
}

function actioncol(params) {
  return (
    <>
    <IconButton
      size="small"
      sx={{
        margin: "0px 10px 0px 0px",
        border: 1,
      }}
      disableRipple
      color="action"
    >
      <Icon>edit</Icon>
    </IconButton>
    <IconButton
      size="small"
      disableRipple
      color="error"
      sx={{ border: 1 }}
    >
      <Icon>delete_forever</Icon>
    </IconButton>
  </>
  );
}

const GridExample = ({columns,rows}) => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const [columnDefs, setColumnDefs] = useState([
    { field: 'id', rowDrag: true },
    { field: 'image',cellRenderer: MyRenderer },
    { field: 'comments',},
    { field: 'options', },
    { field: 'entry_fee', },
    { field: 'win_reward' },
    { field:  "action",cellRenderer: actioncol  },
  ]);



  const defaultColDef = useMemo(() => {
    return {
      width: 230,
      sortable: true,
      filter: false,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then((resp) => resp.json())
      .then((data) => console.log(data,"data---"));
  }, []);




  return (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-alpine">
        <AgGridReact
          rowData={rows}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowDragManaged={true}
          animateRows={true}
          accentedSort={true}
          onGridReady={onGridReady}
        ></AgGridReact>
      </div>
    </div>
  );
};

export default GridExample;