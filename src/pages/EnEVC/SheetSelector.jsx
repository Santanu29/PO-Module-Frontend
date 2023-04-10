import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Card, DropdownButton, Dropdown } from 'react-bootstrap';

const SheetSelector = ({
  workbook,
  selectedSheetIndex,
  setSelectedSheetIndex,
  setData,
  setHeader,
}) => {
  const handleSelectChange = (e) => {
    setSelectedSheetIndex(e);
    const worksheetNames = workbook.SheetNames;
    const selectedWorksheet = workbook.Sheets[worksheetNames[e]];
    const sheetData = XLSX.utils.sheet_to_json(selectedWorksheet, {
      raw: false,
      dateNF: 'yyyy-mm-dd',
      cellDates: true,
    });
    const sheetData1 = XLSX.utils.sheet_to_json(selectedWorksheet, {
      header: 1,
      raw: false,
      dateNF: 'yyyy-mm-dd',
      cellDates: true,
    });
    console.log(sheetData1, 'sheetdata header');
    setData(sheetData);
    setHeader(sheetData1[0]);
  };

  return (
    <Card>
      <Card.Body>
        <div className='d-flex justify-content-between mt-1'>
          <h5 className='mt-1 fw-bolder'>
            Selected Sheet: {workbook.SheetNames[selectedSheetIndex]}
          </h5>
          <DropdownButton
            className='mb-1'
            label='Selected Sheet :'
            title='Select sheet'
            onSelect={handleSelectChange}
          >
            {workbook.SheetNames.map((sheetName, index) => (
              <Dropdown.Item key={index} eventKey={index}>
                {sheetName}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SheetSelector;
