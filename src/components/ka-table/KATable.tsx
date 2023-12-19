import React, { useState } from "react";
import { DataType, Table, useTable } from "ka-table";
import Button from "../re-usable/Button";
import fetchData from "../../services/fetchData";
import "./KATable.css";

const loadMoreData: string = 'LOAD_MORE_DATA';
const itemsPerPage = 30;
const columns: any = [
    { key: 'id', title: 'ID', dataType: DataType.Number },
    { key: 'zipCode', title: 'Zip Code', dataType: DataType.String },
    { key: 'city', title: 'City', dataType: DataType.String },
    { key: 'state', title: 'State', dataType: DataType.String },
    { key: 'country', title: 'Country', dataType: DataType.String },
    { key: 'id', title: 'ID', dataType: DataType.Number },
    { key: 'zipCode', title: 'Zip Code', dataType: DataType.String },
    { key: 'city', title: 'City', dataType: DataType.String },
    { key: 'state', title: 'State', dataType: DataType.String },
    { key: 'country', title: 'Country', dataType: DataType.String }
];

const KATable = () => {
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [data, setData] = useState<any[]>([]);

    const table = useTable({
        onDispatch: async (action: any) => {
            if (pageIndex !== -1) {
                if (action.type === loadMoreData) {
                    table.showLoading();
                    const first = (pageIndex - 1) * itemsPerPage;
                    const last = pageIndex * itemsPerPage - 1;
                    const url = `http://localhost:6001/static-data/zipcode?first=${first}&last=${last}`;
                    const method = {
                        method: 'GET',
                    };
                    const response: any = await fetchData(url, method);
                    const pageCount = response[response.length - 1] !== 9999999
                        ? pageIndex + 1
                        : -1;
                    setPageIndex(pageCount);
                    table.hideLoading();
                    setData([...data, ...response])
                }
            }
        }
    });

    return (
        <div className="table-section-container">
            <div>
                <Button name="Home" link="/" />
            </div>
            <div className="table-section">
                <Table
                    table={table}
                    columns={columns}
                    data={data}
                    rowKeyField={'id'}
                    virtualScrolling={{
                        enabled: true
                    }}
                    singleAction={{ type: loadMoreData }}
                    childComponents={{
                        tableWrapper: {
                            elementAttributes: () => ({
                                onScroll: (event, { baseFunc, dispatch }) => {
                                    baseFunc(event);
                                    const element = event.currentTarget;
                                    const BOTTOM_OFFSET = 20;
                                    if (element.offsetHeight + element.scrollTop >= element.scrollHeight - BOTTOM_OFFSET) {
                                        dispatch({ type: loadMoreData });
                                    }
                                },
                                style: { maxHeight: '60vh', width: '100%', overflow: 'scroll' }
                            })
                        }
                    }}
                />
            </div>
        </div>
    )
}

export default KATable