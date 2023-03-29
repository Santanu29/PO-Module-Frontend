import { useState, useEffect } from 'react';
import { Row, Col, Table, DropdownButton, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../../config.json';

const EVDataMap = (props) => {
  const [data, setData] = useState(null);
  const [id, setId] = useState(0);
  const [sheet, setSheet] = useState(null);
  const [keyValue, setKey] = useState(null);

  useEffect(() => {
    setId(0);
    setSheet(null);
  }, [props.data]);

  useEffect(() => {
    const readData = () => {
      var sheetdata = props.data[id];
      setData(sheetdata);
      setSheet(props.sheet[id]);
      if (sheetdata) setKey(Object.keys(sheetdata[0]));
    };
    readData();
  }, [id, props.data, props.sheet, sheet]);

  const handleSelect = (e) => {
    setId(e);
  };

  const handleSubmit = (e) => {
    axios
      .post(`${config.SERVER_URL}xlData`, data)
      .then((d) => {
        toast.info('Data Submitted Successfully');
      })
      .catch((err) => {
        toast.error('Something went wrong');
      });
  };

  return (
    <div>
      <Row>
        <div className='d-flex justify-content-between mt-1' as={Col}>
          <h5 className='mt-1 fw-bolder'>Selected Sheet: {sheet}</h5>
          <DropdownButton
            className='mb-1'
            label='Selected Sheet :'
            title='Select sheet'
            onSelect={handleSelect}
          >
            {props.sheet.map((x, y) => (
              <Dropdown.Item key={y} eventKey={y}>
                {x}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </div>

        <Col md={12}>
          <div
            className='border'
            style={{
              overflowY: 'scroll',
              maxHeight: '300px',
              minHeight: '200px',
            }}
          >
            {keyValue ? (
              <Table responsive>
                <tbody className='border'>
                  <tr>
                    {keyValue.map((dat, i) => (
                      <th key={i} className='bg-light'>
                        {dat}
                      </th>
                    ))}
                  </tr>
                  {data.map((numList, i) => (
                    <tr key={i}>
                      {keyValue.map((num, j) => (
                        <td key={j}>{numList[num]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : null}
          </div>
          <div className='d-grid gap-3 d-md-block'>
            <button
              className='mt-3 btn btn-outline-primary'
              onClick={handleSubmit}
            >
              Submit
            </button>
            <span style={{ margin: '3px' }} />
            <button
              className='btn btn-outline-danger mt-3'
              type='reset'
              onClick={() => props.handleReset()}
            >
              Cancel
            </button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default EVDataMap;
