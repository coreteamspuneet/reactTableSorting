
import {
  Table,
  Thead,
  Tbody,
  // Tfoot,
  Tr,
  Th,
  Td,
  // TableCaption,
  TableContainer,
} from '@chakra-ui/react'

import data from './MOCK_DATA.json'

// import { useTable, useSortBy } from 'react-table';
import { useReactTable, getSortedRowModel } from '@tanstack/react-table'

const App = () => {
  console.log('data', data);
  const columns = [
    {
      header: 'ID',
      accessorKey: 'id'
    },
    {
      header: 'First Name',
      accessorKey: 'first_name'
    },
    {
      header: 'Last Name',
      accessorKey: 'last_name'
    },
    {
      header: 'Gender',
      accessorKey: 'gender'
    },
    {
      header: 'Email',
      accessorKey: 'email'
    },
    {
      header: 'Ip Address',
      accessorKey: 'ip_address'
    },
  ]

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useReactTable({ columns, data, getSortedRowModel: getSortedRowModel(), });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useReactTable({ columns, data, getSortedRowModel: getSortedRowModel(), });
  return (
    <TableContainer>
      <Table size='sm' variant='striped' {...getTableProps()}>
        <Thead>
          {headerGroups?.map((hg) => {
            return (
              <>
                <Tr key={hg.id} {...hg?.getHeaderGroupProps()}>
                  {
                    hg?.headers?.map((column) => {
                      return (
                        <>
                          {/* <Th {...column.getHeaderProps(column.getToggleHiddenProps())}> */}
                          <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                            {column?.render("header")}
                            <span>
                              {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                            </span>
                          </Th>
                        </>
                      )
                    })
                  }
                </Tr>
              </>
            )
          })}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {
            rows.map((row) => {
              prepareRow(row)
              return (
                <>
                  <Tr {...row.getRowProps()}>
                    {
                      row.cells.map((cell) => {
                        return (
                          <>
                            <Td {...cell.getCellProps()}>{cell.render("cell")}</Td>
                          </>
                        )
                      })
                    }
                  </Tr>
                </>
              )
            })
          }
        </Tbody>
        {/* <Tfoot>
          {headerGroups?.map((hg) => {
            console.log('hg_key', hg);
            return (
              <>
                <Tr key={hg.id}  {...hg?.getHeaderGroupProps()}>
                  {
                    hg?.headers?.map((header) => {
                      return (
                        <>
                          <Th key={header?.Header} {...header.getHeaderProps()}>
                            {header?.render("Header")}
                          </Th>
                        </>
                      )
                    })
                  }
                </Tr>
              </>
            )
          })
          }
        </Tfoot> */}
      </Table>
    </TableContainer>
  )
}

export default App