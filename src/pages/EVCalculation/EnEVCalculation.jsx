import React, { useEffect, useState } from 'react';
import classes from './EVCalculation.module.scss';
import DataGrid from 'react-data-grid';
import { read, utils, writeFile } from 'xlsx';
import 'react-data-grid/lib/styles.css';
import { Table } from 'react-bootstrap';

function autoFocusAndSelect(input) {
  input?.focus();
  input?.select();
}

export function textEditor({ row, column, onRowChange, onClose }) {
  return (
    <input
      className={classes.textEditorClassname}
      ref={autoFocusAndSelect}
      value={row[column.key]}
      onChange={(event) =>
        onRowChange({ ...row, [column.key]: event.target.value })
      }
      onBlur={() => onClose(true)}
    />
  );
}
function arrayify(rows) {
  return rows.map((row) => {
    if (Array.isArray(row)) return row;
    var length = Object.keys(row).length;
    for (; length > 0; --length) if (row[length - 1] != null) break;
    return Array.from({ length, ...row });
  });
}

const getRowsCols = (data, sheetName) => ({
  rows: utils.sheet_to_json(data[sheetName], { header: 1 }),
  columns: Array.from(
    {
      length: utils.decode_range(data[sheetName]['!ref'] || 'A1').e.c + 1,
    },
    (_, i) => ({
      key: String(i),
      name: utils.encode_col(i),
      editor: textEditor,
    }),
  ),
});

const EnEVCalculation = () => {
  const [data, setData] = useState(null);
  const [keyValue, setKey] = useState(null);
  const [rows, setRows] = useState([]); // data rows
  const [columns, setColumns] = useState([]); // columns
  const [workBook, setWorkBook] = useState({}); // workbook
  const [sheets, setSheets] = useState([]); // list of sheet names
  const [current, setCurrent] = useState(''); // selected sheet

  /* called when sheet dropdown is changed */
  function selectSheet(name) {
    /* update workbook cache in case the current worksheet was changed */
    workBook[current] = utils.aoa_to_sheet(arrayify(rows));

    /* get data for desired sheet and update state */
    const { rows: new_rows, columns: new_columns } = getRowsCols(
      workBook,
      name,
    );
    setRows(new_rows);
    setColumns(new_columns);
    setCurrent(name);
  }
  const defaultColumnProperties = {
    resizable: true,
    width: 120,
  };
  const sortRows = (initialRows, sortColumn, sortDirection) => (rows) => {
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return a[sortColumn] > b[sortColumn] ? 1 : -1;
      } else if (sortDirection === 'DESC') {
        return a[sortColumn] < b[sortColumn] ? 1 : -1;
      }
    };
    return sortDirection === 'NONE' ? initialRows : [...rows].sort(comparer);
  };
  /* this method handles refreshing the state with new workbook data */
  async function handleAB(file) {
    /* read file data */
    const data = read(file);
    console.log(data);
    /* update workbook state */
    setWorkBook(data.Sheets);
    setSheets(data.SheetNames);

    /* select the first worksheet */
    const name = data.SheetNames[0];
    const { rows: new_rows, columns: new_columns } = getRowsCols(
      data.Sheets,
      name,
    );
    setRows(new_rows);
    setColumns(new_columns);
    setCurrent(name);
  }

  /* called when file input element is used to select a new file */
  async function handleFile(ev) {
    const file = await ev.target.files?.[0]?.arrayBuffer();
    if (file) await handleAB(file);
  }

  /* when page is loaded, fetch and processs worksheet */
  useEffect(() => {
    (async () => {
      const f = await fetch('https://sheetjs.com/pres.numbers');
      await handleAB(await f.arrayBuffer());
    })();
  }, []);

  /* method is called when one of the save buttons is clicked */
  function saveFile(ext) {
    console.log('current', current);
    /* update current worksheet in case changes were made */
    workBook[current] = utils.aoa_to_sheet(arrayify(rows));

    /* construct workbook and loop through worksheets */
    const wb = utils.book_new();
    sheets.forEach((n) => {
      utils.book_append_sheet(wb, workBook[n], n);
    });

    /* generate a file and download it */
    writeFile(wb, 'SheetJSRDG.' + ext);
  }

  return (
    <>
      <h3>Slect File</h3>
      <input type='file' onChange={handleFile} />
      {sheets.length > 0 && (
        <>
          <p>
            Use the dropdown to switch to a worksheet:&nbsp;
            <select
              onChange={async (e) => selectSheet(sheets[+e.target.value])}
            >
              {sheets.map((sheet, idx) => (
                <option key={sheet} value={idx}>
                  {sheet}
                </option>
              ))}
            </select>
          </p>
          <div className='flex-cont'>
            <b>Current Sheet: {current}</b>
          </div>
          {columns ? (
            <Table responsive>
              {/* {console.log('columns', columns)}
              {console.log('rows', rows)}
              <tbody className='border'>
                <tr>
                  {rows[0].map((dat, i) => (
                    <th key={i} className='bg-light'>
                      {dat}
                    </th>
                  ))}
                </tr>
                {rows.map((numList, i) => (
                  <tr key={i}>{numList[i]}</tr>
                ))}
              </tbody> */}
            </Table>
          ) : null}
          <DataGrid
            className='rdg-light'
            rowGetter={(i) => rows[i]}
            enableCellSelect={true}
            columns={columns}
            rows={rows}
            onRowsChange={setRows}
            onGridSort={(sortColumn, sortDirection) =>
              setRows(sortRows(initialRows, sortColumn, sortDirection))
            }
          />
          <p>
            Click one of the buttons to create a new file with the modified data
          </p>
          <div className='flex-cont'>
            {['xlsx', 'xlsb', 'xls'].map((ext) => (
              <button key={ext} onClick={() => saveFile(ext)}>
                export [.{ext}]
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EnEVCalculation;
