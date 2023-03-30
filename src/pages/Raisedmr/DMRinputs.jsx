import axios from 'axios';
import { memo, useState } from 'react';
import { Button, Form, InputGroup, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import config from '../../config.json';

const DMRinputs = ({ details }) => {
  const data = details.details;
  const [inputList, setInputList] = useState(data);

  const handleSubmit = (e) => {
    e.preventDefault(details.ponumber);
    axios
      .patch(`${config.SERVER_URL}poDetails/${details.ponumber}`, data)
      .then((d) => {
        console.log('Response', d);
        toast.success('Data Updated Successfully.');
      })
      .catch((err) => {
        toast.error('Data Not Updated.');
      });
  };

  return (
    <div>
      <div className='d-flex justify-content-evenly m-3'>
        <InputGroup className='mt-3 mb-3'>
          <InputGroup.Text>PO Number </InputGroup.Text>
          <Form.Control name='ponumber' value={details.ponumber} disabled />
        </InputGroup>
        <span className='input-group-btn' style={{ width: '10px' }}></span>
        <InputGroup className='mt-3 mb-3'>
          <InputGroup.Text>Date </InputGroup.Text>
          <Form.Control
            label='Enter Amount'
            name='date'
            value={details.date}
            disabled
          />
        </InputGroup>
        <span className='input-group-btn' style={{ width: '10px' }}></span>
        <InputGroup className='mt-3 mb-3 File'>
          <InputGroup.Text>File </InputGroup.Text>
          <Form.Control
            name='poFile'
            value={details.filename.replace(/_+/g, ' ')}
            disabled
          />
          <a
            href={`${config.SERVER_URL}dbFile/${details.filename}`}
            target='_blank'
            rel='noreferrer'
          >
            <svg
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
              <g
                id='SVGRepo_tracerCarrier'
                strokeLinecap='round'
                strokeLinejoin='round'
              ></g>
              <g id='SVGRepo_iconCarrier'>
                <path
                  d='m8 12 4 4 4-4'
                  stroke='#000000'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                ></path>
                <path
                  d='M12 16V4M19 17v.6c0 1.33-1.07 2.4-2.4 2.4H7.4C6.07 20 5 18.93 5 17.6V17'
                  stroke='#000000'
                  strokeWidth='1.5'
                  strokeMiterlimit='10'
                  strokeLinecap='round'
                ></path>
              </g>
            </svg>
          </a>
        </InputGroup>
      </div>
      <Table striped bordered hover responsive='sm' variant='light'>
        <thead>
          <tr>
            <th>Product</th>
            <th>Amount</th>
            <th>Raised Amount</th>
            <th>DMR No.</th>
          </tr>
        </thead>
        <tbody>
          {data.map((elementInArray, index) => {
            return (
              <tr key={index}>
                <th scope='row'>
                  <Form.Control
                    name='description'
                    id='description'
                    value={elementInArray.description}
                    disabled
                  />
                </th>
                <td>
                  <Form.Control
                    name='amount'
                    id='amount'
                    value={elementInArray.amount}
                    disabled
                  />
                </td>
                <td>
                  <Form.Control
                    name='raisedAmount'
                    id='raisedAmount'
                    value={elementInArray.raisedAmount}
                    onChange={(e) => {
                      elementInArray.raisedAmount = e.target.value;
                      setInputList({ ...inputList });
                    }}
                  />
                </td>
                <td>
                  <Form.Control
                    name='dmrNo'
                    id='dmrNo'
                    value={elementInArray.dmrNo}
                    onChange={(e) => {
                      elementInArray.dmrNo = e.target.value;
                      setInputList({ ...inputList });
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div className='d-flex justify-content-between mb-3'>
        <Button
          type='submit'
          className='mx-auto col-md-6 submitBtn'
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default memo(DMRinputs);
