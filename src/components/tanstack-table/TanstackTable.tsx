import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query'

// import './index.css'

import { useVirtualizer } from '@tanstack/react-virtual';
import Button from '../re-usable/Button';
import fetchData from '../../services/fetchData';

import "./Tanstack.css";

interface TableRow {
  id: number;
  zipCode: string;
  city: string;
  state: string;
  country: string;
}

async function fetchServerPage(limit: number, offset: number = 0): Promise<{ rows: TableRow[]; nextOffset: number }> {
  const firstRecord = offset * limit;
  const lastRecord = (offset + 1) * limit - 1; // Adjusted to get the correct range

  const url = `http://localhost:6001/static-data/zipcode?first=${firstRecord}&last=${lastRecord}`;
  const method = {
    method: 'GET',
  };

  const response = await fetchData(url, method);

  const rows = response.map((item: any) => ({
    id: item.id,
    zipCode: item.zipCode,
    city: item.city,
    state: item.state,
    country: item.country,
  }));

  return { rows, nextOffset: offset + 1 };
}

const TanstackTable = () => {
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'projects',
    (ctx: any) => fetchServerPage(10, ctx.pageParam),
    {
      getNextPageParam: (_lastGroup: any, groups: any) => groups.length,
    },
  )

  const allRows = data ? data.pages.flatMap((d: any) => d.rows) : []

  const parentRef: any = React.useRef()

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  })

  React.useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse()

    if (!lastItem) {
      return
    }

    if (
      lastItem.index >= allRows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage()
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allRows.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ])

  return (
    <div className="table-section-container">
      <div>
        <Button name="Home" link="/" />
      </div>
      <div className="table-section">
        {status === 'loading' ? (
          <p>Loading...</p>
        ) : status === 'error' ? (
          <span>Error: {(error as Error).message}</span>
        ) : (
          <div>
            {/* Column Headers */}
            <div className="HeaderRow">
              <div className="ColumnHeader">ID</div>
              <div className="ColumnHeader">Zip Code</div>
              <div className="ColumnHeader">City</div>
              <div className="ColumnHeader">State</div>
              <div className="ColumnHeader">Country</div>
              <div className="ColumnHeader">ID</div>
              <div className="ColumnHeader">Zip Code</div>
              <div className="ColumnHeader">City</div>
              <div className="ColumnHeader">State</div>
              <div className="ColumnHeader">Country</div>
            </div>

            {/* Data Rows */}
            <div ref={parentRef} className="List"
              style={{
                height: `60vh`,
                width: `100%`,
                overflow: 'auto',
              }}
            >
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const isLoaderRow = virtualRow.index > allRows.length - 1
                  const row = allRows[virtualRow.index];

                  return (
                    <div
                      key={virtualRow.index}
                      className={
                        virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'
                      }
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      {isLoaderRow
                        ? hasNextPage
                          ? 'Loading more...'
                          : 'Nothing more to load'
                        : (<>
                          <div className="Column">{row.id}</div>
                          <div className="Column">{row.zipCode}</div>
                          <div className="Column">{row.city}</div>
                          <div className="Column">{row.state}</div>
                          <div className="Column">{row.country}</div>
                          <div className="Column">{row.id}</div>
                          <div className="Column">{row.zipCode}</div>
                          <div className="Column">{row.city}</div>
                          <div className="Column">{row.state}</div>
                          <div className="Column">{row.country}</div>
                        </>)}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
        <div>
          {isFetching && !isFetchingNextPage ? 'Background Updating...' : null}
        </div>
      </div>
    </div>
  )
}

export default TanstackTable