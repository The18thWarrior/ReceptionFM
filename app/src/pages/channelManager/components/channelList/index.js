import env from "react-dotenv";
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useContractCall } from "@usedapp/core";

//let worksManagerAddress = env.REACT_APP_WORKSMANAGER_ADDRESS;

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: false,
    sortable: true
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: false,
    sortable: true
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
    editable: false,
    sortable: true
  }
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

function ChannelList() {
  console.log('loading channelList');
  return (
    <div className="dark-background" style={{ height: '100%'}}>
      <div style={{ height: 400, width: '100%'}}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          disableColumnMenu
        />
      </div>
    </div>
  );
}

export default ChannelList;