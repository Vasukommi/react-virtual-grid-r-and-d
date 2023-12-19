import React, { useCallback, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import Button from '../re-usable/Button';
import fetchData from '../../services/fetchData';

const AGGrid = () => {
    const containerStyle = useMemo(() => ({ width: '100%', height: '60vh' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

    const [columnDefs, setColumnDefs] = useState([
        // this row shows the row index, doesn't use any data from the row
        {
            headerName: 'ID',
            maxWidth: 100,
            // it is important to have node.id here, so that when the id changes (which happens
            // when the row is loaded) then the cell is refreshed.
            valueGetter: 'node.id',
            cellRenderer: (props: any) => {
                if (props.value !== undefined) {
                    return props.value;
                } else {
                    return (
                        <img src="https://www.ag-grid.com/example-assets/loading.gif" />
                    );
                }
            },
        },
        { field: 'id', minWidth: 150 },
        { field: 'zipCode' },
        { field: 'city', minWidth: 150 },
        { field: 'state' },
        { field: 'country', minWidth: 150 },
        { field: 'zipCode' },
        { field: 'city', minWidth: 150 },
        { field: 'state' },
        { field: 'country', minWidth: 150 },
        { field: 'zipCode' },
        { field: 'city', minWidth: 150 },
        { field: 'state' },
        { field: 'country', minWidth: 150 }
    ]);
    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            minWidth: 100,
            sortable: false,
        };
    }, []);


    const fetchRowCount = async () => {
        const rowCount = 9999999;
        return rowCount;
    };
    const onGridReady = useCallback(async (params: any) => {
        const dataSource = {
            rowCount: undefined,
            getRows: async (params: any) => {
                console.log(
                    'asking for ' + params.startRow + ' to ' + params.endRow
                );
                const first = params.startRow ? params.startRow : 0;
                const last = params.endRow ? params.endRow : 0;

                const url = `http://localhost:6001/static-data/zipcode?first=${first}&last=${last}`;
                const method = {
                    method: 'GET',
                };

                try {
                    const response = await fetchData(url, method);
                    const data = response || [];
                    const rowCount = await fetchRowCount(); // Fetch total row count from your API or another source

                    let lastRow = -1;
                    if (rowCount <= params.endRow) {
                        lastRow = rowCount;
                    }

                    params.successCallback(data, lastRow);
                } catch (error) {
                    console.error('Error:', error);
                }
            },
        };
        params.api.setDatasource(dataSource);
    }, []);

    return (
        <div className="table-section-container">
            <div>
                <Button name="Home" link="/" />
            </div>
            <div className="table-section">
                <div style={containerStyle}>
                    <div
                        style={gridStyle}
                        className={
                            "ag-theme-quartz"
                        }
                    >
                        <AgGridReact
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            rowBuffer={0}
                            rowSelection={'multiple'}
                            rowModelType={'infinite'}
                            cacheBlockSize={100}
                            cacheOverflowSize={2}
                            maxConcurrentDatasourceRequests={1}
                            infiniteInitialRowCount={1000}
                            maxBlocksInCache={10}
                            onGridReady={onGridReady}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AGGrid