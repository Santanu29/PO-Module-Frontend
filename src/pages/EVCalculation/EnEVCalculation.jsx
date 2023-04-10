import { useState, useRef } from 'react';
import {
  Table,
  Button,
  Card,
  Container,
  DropdownButton,
  Dropdown,
  Row,
  Col,
  Form,
  Alert,
} from 'react-bootstrap';
import * as XLSX from 'xlsx';
import axios from 'axios';

const EnEVCalculation = () => {
  const [data, setData] = useState([]);
  const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);
  const [workbook, setWorkbook] = useState(null);
  const [fileError, setFileError] = useState('');
  const [dataError, setDataError] = useState('');
  const [validationError, setValidationError] = useState('');
  const inputFileRef = useRef(null);

  const handleFileUpload = (e) => {
    e.preventDefault();
    setFileError('');
    setDataError('');
    setValidationError('');
    try {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        setWorkbook(workbook);
        const worksheetNames = workbook.SheetNames;
        const selectedWorksheet =
          workbook.Sheets[worksheetNames[selectedSheetIndex]];
        const sheetData = XLSX.utils.sheet_to_json(selectedWorksheet, {
          header: 1,
          raw: false,
          dateNF: 'yyyy-mm-dd',
          cellDates: true,
        });
        // Loop through each row in the sheetData and replace empty values with 0 for a particular row
        const modifiedSheetData = sheetData.map((row, index) => {
          if (index === 2) {
            // Replace empty values with 0 for row at index 2
            return row.map((cell) => (cell === '' ? 0 : cell));
          }
          return row;
        });
        // Validate data
        const numCols = modifiedSheetData[0].length;
        const isValid = modifiedSheetData.every(
          (row) => row.length === numCols,
        );
        if (!isValid) {
          setValidationError('Invalid data format.');
        } else {
          setData(modifiedSheetData);
        }
      };
      reader.readAsBinaryString(file);
    } catch (error) {
      setFileError('Error reading file. Please select a valid Excel file.');
    }
  };

  const handleSelectChange = (event) => {
    setSelectedSheetIndex(event);
    const worksheetNames = workbook.SheetNames;
    const selectedWorksheet = workbook.Sheets[worksheetNames[event]];
    const sheetData = XLSX.utils.sheet_to_json(selectedWorksheet, {
      header: 1,
      raw: false,
      dateNF: 'yyyy-mm-dd',
      cellDates: true,
    });
    setData(sheetData);
  };

  const handleRemoveFile = () => {
    setData([]);
    setWorkbook(null);
    setFileError('');
    setDataError('');
    setValidationError('');
    setSelectedSheetIndex(0);
    inputFileRef.current.value = null;
  };

  const handleSubmit = async () => {
    if (data.length === 0) {
      setDataError('No data to submit.');
      return;
    }
    try {
      const response = await axios.post('/api/submit-sheet-data', { data });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container fluid>
      <Row className='mt-3'>
        <Col>
          <Form>
            <Card className='text-center mt-3 files'>
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
        </Col>
      </Row>
      {data.length > 0 && (
        <Row className='mt-3'>
          <Col>
            <Card>
              <Card.Body>
                <Row>
                  <div className='d-flex justify-content-between mt-1' as={Col}>
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
                </Row>
                {validationError && (
                  <Alert variant='danger'>{validationError}</Alert>
                )}
                <div
                  className='table-responsive'
                  style={{ maxHeight: '90vh', overflow: 'scroll' }}
                >
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        {data[0].map((cell, index) => (
                          <th
                            key={index}
                            style={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {typeof cell === 'number'
                              ? cell.toLocaleString()
                              : cell}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.slice(1).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {typeof cell === 'number'
                                ? cell.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 5,
                                  })
                                : cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                {dataError && <Alert variant='warning'>{dataError}</Alert>}
                <Button
                  className='mt-3'
                  variant='primary'
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default EnEVCalculation;
