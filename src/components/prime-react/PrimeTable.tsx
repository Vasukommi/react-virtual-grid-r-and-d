import { useState, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Skeleton } from "primereact/skeleton";
import { VirtualScrollerLazyEvent, VirtualScrollerLoadingTemplateOptions } from "primereact/virtualscroller";
import Button from "../re-usable/Button";
import fetchData from "../../services/fetchData";
import "./PrimeTable.css";

import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import "../../flags.css";
import "../../App.css";

interface Country {
    id: number;
    zipCode: string;
    city: string;
    state: string;
    country: string;
};

const columns = [
    { id: 1, field: 'id', header: 'ID' },
    { id: 2, field: 'zipCode', header: 'Zip Code' },
    { id: 3, field: 'city', header: 'City' },
    { id: 4, field: 'state', header: 'State' },
    { id: 5, field: 'country', header: 'Country' },
    { id: 6, field: 'country', header: 'Country1' },
    { id: 7, field: 'country', header: 'Country2' },
    { id: 8, field: 'country', header: 'Country3' },
    { id: 9, field: 'country', header: 'Country4' },
    { id: 10, field: 'country', header: 'Country5' },
    { id: 11, field: 'state', header: 'State1' },
    { id: 12, field: 'state', header: 'State2' },
    { id: 13, field: 'state', header: 'State3' }
];

const PrimeTable = () => {
    const [virtualCountries, setVirtualCountries] = useState<any[]>(Array.from({ length: 999999 }));
    const [lazyLoading, setLazyLoading] = useState<boolean>(false);

    const loadCountriesData = useCallback(async (event: VirtualScrollerLazyEvent) => {
        !lazyLoading && setLazyLoading(true);
        let { first, last }: any = event;

        let countriesData: any = [...virtualCountries];
        const url = `http://localhost:6001/static-data/zipcode?first=${first}&last=${last}`;
        const method = {
            method: 'GET',
        };

        const countriesResponse: any[] = await fetchData(url, method);
        countriesData.splice(first, (last - first), ...countriesResponse);

        setVirtualCountries(countriesData);
        setLazyLoading(false);
    }, []);

    const loadingTemplate = (options: VirtualScrollerLoadingTemplateOptions) => {
        return (
            <div className="flex align-items-center" style={{ height: '17px', flexGrow: '1', overflow: 'hidden' }}>
                <Skeleton width={options.cellEven ? (options.field === 'year' ? '30%' : '40%') : '60%'} height="1rem" />
            </div>
        )
    }

    return (
        <div className="table-section-container">
            <div>
                <Button name="Home" link="/" />
            </div>
            <div className="table-section">
                <DataTable
                    value={virtualCountries}
                    scrollable
                    scrollHeight="60vh"
                    virtualScrollerOptions={{
                        lazy: true,
                        onLazyLoad: loadCountriesData,
                        itemSize: 46,
                        delay: 200,
                        showLoader: true,
                        loading: lazyLoading,
                        loadingTemplate
                    }}
                >
                    {columns.map((column: any) => (
                        <Column key={column.id} field={column.field} header={column.header} />
                    ))}
                </DataTable>
            </div>
        </div>
    )
}

export default PrimeTable