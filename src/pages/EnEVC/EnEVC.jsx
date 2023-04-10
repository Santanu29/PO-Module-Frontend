import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import FileUploader from './FileUploader';
import SheetSelector from './SheetSelector';
import DataTable from './DataTable';
import { toast } from 'react-toastify';
import config from '../../config.json';

const EnEVC = () => {
  const [data, setData] = useState([]);
  const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);
  const [workbook, setWorkbook] = useState(null);
  const [header, setHeader] = useState([]);
  const [fileError, setFileError] = useState('');
  const [dataError, setDataError] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (data.length === 0) {
      return;
    } else {
      console.log(data[selectedSheetIndex]);
      console.log(Object.getOwnPropertyDescriptors(data[selectedSheetIndex]));
    }
  });
  const handleSubmit = async (e) => {
    if (data.length === 0) {
      setDataError('No data to submit.');
      return;
    }
    try {
      const response = await axios.post(`${config.SERVER_URL}xlData`, data);
      console.log(typeof data);
      console.log(data);
      axios.then((d) => {
        console.log(d);
        if (d.status === 404) toast.error('404 (Not Found)');
        if (d.status === 200) toast.info('Data Submitted Successfully');
        toast.info(`${d.statusText}`);
      });
      console.log(response.data);
    } catch (error) {
      //   toast.error(`${error.message}`);
      console.error(error.message);
    }
  };

  return (
    <Container fluid>
      <Row className='mt-3'>
        <Col>
          <FileUploader
            data={data}
            fileError={fileError}
            setData={setData}
            setWorkbook={setWorkbook}
            setFileError={setFileError}
          />
        </Col>
      </Row>
      {data.length > 0 && (
        <Row className='mt-3'>
          <Col>
            <SheetSelector
              workbook={workbook}
              selectedSheetIndex={selectedSheetIndex}
              setSelectedSheetIndex={setSelectedSheetIndex}
              setData={setData}
              setHeader={setHeader}
            />
            {validationError && (
              <Alert variant='danger'>{validationError}</Alert>
            )}
            <DataTable data={data} headers={header} />
            {dataError && <Alert variant='warning'>{dataError}</Alert>}
            <Button className='mt-3' variant='primary' onClick={handleSubmit}>
              Submit
            </Button>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default EnEVC;
