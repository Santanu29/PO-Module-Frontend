import { useState, useRef } from 'react';
import { Card, Form, Alert } from 'react-bootstrap';
import * as XLSX from 'xlsx';

const FileUploader = ({
  data,
  fileError,
  setData,
  setWorkbook,
  setFileError,
}) => {
  const inputFileRef = useRef(null);

  const handleFileUpload = (e) => {
    e.preventDefault();
    setFileError('');
    try {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const workbook = XLSX.read(event.target.result, {
          type: 'binary',
          cellFormula: true,
        });
        setWorkbook(workbook);
        const selectedWorksheet = workbook.Sheets[workbook.SheetNames[0]];
        const sheetData = XLSX.utils.sheet_to_json(selectedWorksheet, {
          header: 1,
          raw: false,
          dateNF: 'yyyy-mm-dd',
          cellDates: true,
        });

        const modifiedSheetData = sheetData.map((row, index) => {
          if (index === 1) {
            return row.map((cell) => (cell == null || cell === '' ? 0 : cell));
          }
          return row;
        });
        console.log(modifiedSheetData, 'sheetdata');
        // Validate data
        const numCols = modifiedSheetData[0].length;
        const isValid = modifiedSheetData.every(
          (row) => row.length === numCols,
        );
        if (!isValid) {
          setFileError('Invalid data format.');
        } else {
          setData(modifiedSheetData);
        }
      };
      reader.readAsBinaryString(file);
    } catch (error) {
      setFileError('Error reading file. Please select a valid Excel file.');
    }
  };

  const handleRemoveFile = () => {
    setData([]);
    setWorkbook(null);
    setFileError('');
    inputFileRef.current.value = null;
  };

  return (
    <Form>
      <Card className='text-center files'>
        <Card.Header>Upload Excel file</Card.Header>
        <Card.Body>
          <Card.Text>
            <input
              placeholder='Select File..'
              title='file'
              type='file'
              name='file'
              onChange={handleFileUpload}
              ref={inputFileRef}
              accept='.xlsx'
              required
            />
            {data.length > 0 ? (
              <i className='fa fa-close' onClick={handleRemoveFile} />
            ) : null}
          </Card.Text>
          {fileError ? <Alert variant='danger'>{fileError}</Alert> : null}
        </Card.Body>
      </Card>
    </Form>
  );
};

export default FileUploader;
