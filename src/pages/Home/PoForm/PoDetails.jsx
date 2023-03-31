import { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import AddRows from './AddRows';
import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../../../config.json';

const PoDetails = ({ file, handleReset, fileName }) => {
  const [inputList, setInputList] = useState({
    po_id: '',
    poname: '',
    projectName: '',
    date: '',
    items: [{ index: Math.random(), po_description: '', amount: '' }],
    filename: fileName.replace(/\s+/g, '_'),
  });

  const handleAddRows = (e) => {
    setInputList({
      ...inputList,
      items: [
        ...inputList.items,
        { index: Math.random(), po_description: '', amount: '' },
      ],
    });
  };

  const handleRemoveRows = (index) => {
    setInputList({
      ...inputList,
      items: inputList.items.filter((s, sindex) => index !== sindex),
    });
  };

  const formSubmit = (e) => {
    e.preventDefault();
    if (inputList.po_id.length === 0) {
      alert('Please fill PO Number.');
    } else if (inputList.date.length === 0) {
      alert('Please fill date.');
    } else {
      const details = inputList;
      var filename = new FormData();
      filename.append('file', file);
      let data = { details, filename };
      axios
        .post(`${config.SERVER_URL}poDetails`, data)
        .then((d) => {
          console.log(d.data);
          axios.post(`${config.SERVER_URL}uploadFile`, filename);
          toast.info('Data Submitted Successfully');
        })
        .catch((err) => {
          console.log(err);
          toast.error('Something went wrong');
        });
    }
  };

  return (
    <div className='border p-3 mt-4 mb-3 '>
      <h1 className='text-center'>Please fill Purchase Order details</h1>
      <br />
      <Form className='g-3'>
        <Form.Group>
          <br />
          <Row>
            <Col className='form__group field'>
              <input
                className='text-input form__field'
                type='number'
                placeholder='Enter order number'
                name='ponumber'
                id='ponumber'
                value={inputList.po_id}
                required
                onChange={(e) =>
                  setInputList({ ...inputList, po_id: e.target.value })
                }
              />
              <label for='ponumber' class='form__label'>
                PO Number
              </label>
            </Col>
            <Col className='form__group field'>
              <input
                className='text-input form__field'
                type='text'
                placeholder='Enter PO Name'
                name='poname'
                id='poname'
                value={inputList.poname}
                required
                onChange={(e) =>
                  setInputList({ ...inputList, poname: e.target.value })
                }
              />
              <label for='poname' class='form__label'>
                PO Name
              </label>
            </Col>
            <Col className='form__group field'>
              <input
                className='text-input form__field'
                type='text'
                placeholder='Enter order number'
                name='projectName'
                id='projectName'
                value={inputList.projectName}
                required
                onChange={(e) =>
                  setInputList({ ...inputList, projectName: e.target.value })
                }
              />
              <label for='ponumber' class='form__label'>
                Project Name
              </label>
            </Col>
            <Col className='form__group field'>
              <input
                className='text-input form__field'
                type='date'
                placeholder='Select Date'
                name='date'
                id='date'
                required
                value={inputList.date}
                onChange={(e) =>
                  setInputList({ ...inputList, date: e.target.value })
                }
              />
              <label for='date' class='form__label'>
                Select date
              </label>
            </Col>
          </Row>
          <br />
        </Form.Group>
        <AddRows
          deleted={handleRemoveRows}
          inputList={inputList}
          setInputList={setInputList}
        />
        <Form.Group className='d-flex justify-content-between' as={Col}>
          <div className='  '>
            <button
              className='mt-3 btn btn-outline-primary'
              onClick={formSubmit}
            >
              Submit
            </button>
            <span style={{ margin: '3px' }} />
            <button
              className='btn btn-outline-danger mt-3'
              type='reset'
              onClick={() => handleReset()}
            >
              Cancel
            </button>
          </div>
          <button
            title='addRows'
            onClick={handleAddRows}
            type='button'
            className='btn btn-outline-primary mt-3 '
            style={{ maxHeight: '40px' }}
          >
            <i className='fa fa-plus-circle' aria-hidden='true' />
          </button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default PoDetails;
