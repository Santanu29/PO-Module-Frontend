/* eslint-disable no-unused-vars */
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Form, Card, Row, Col } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import EVDataMap from './EVDataMap';
import config from '../../config.json';

const EvCalculation = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [sheet, setSheet] = useState(null);
  const [data, setData] = useState();
  const fileRef = useRef();

  useEffect(() => {
    document.title = 'EV Calculation';
  });

  const readDataFromExcel = (data1) => {
    const workbook = XLSX.readFile(data1);
    let sheetName = workbook.SheetNames;
    var mySheetData = sheetName.map(function (sheet) {
      const worksheet = workbook.Sheets[sheet];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      return jsonData;
    });
    setData(mySheetData);
    setSheet(sheetName);
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setFile(file);
    const data1 = await file.arrayBuffer();
    readDataFromExcel(data1);
  };

  const handleReset = (e) => {
    setData(null);
    setFileName(null);
    setFile(null);
    fileRef.current.value = '';
  };

  const downloadExcel = () => {
    // const worksheet = XLSX.utils.json_to_sheet(data);
    // const workbook = XLSX.utils.book_new();
    // const sheetname = workbook.SheetNames;
    // XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    axios.get(`${config.SERVER_URL}xlData`).then((d) => {
      console.log(d);
      const workbook = d.data;
      XLSX.writeFile(workbook, 'AllData.xlsx');
    });
  };

  return (
    <div className='container'>
      <button
        className='mt-3 btn btn-outline-dark '
        variant='outline-dark'
        onClick={downloadExcel}
      >
        <i className='fa fa-download'> Download All Data</i>
      </button>
      <Row>
        <Col>
          <Form>
            <Card className='text-center mt-3'>
              <Card.Header>Upload EV File</Card.Header>
              <Card.Body>
                {!fileName && <Card.Title>Please select EV file.</Card.Title>}
                {fileName && (
                  <Card.Title>{fileName} is uploaded successfully</Card.Title>
                )}
                <Card.Text>
                  <input
                    title='selectFile'
                    type='file'
                    name='file'
                    accept='.xlsx'
                    onChange={(e) => handleFile(e)}
                    required
                    ref={fileRef}
                  />
                  {fileName && (
                    <i className='fa fa-close' onClick={handleReset} />
                  )}
                </Card.Text>
              </Card.Body>
            </Card>
          </Form>
        </Col>
      </Row>
      {data ? (
        <EVDataMap data={data} sheet={sheet} id={0} handleReset={handleReset} />
      ) : null}
    </div>
  );
};

export default EvCalculation;
