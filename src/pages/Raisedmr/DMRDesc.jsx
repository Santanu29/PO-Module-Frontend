import axios from 'axios';
import React, { useState } from 'react';
import { Button, Form, Row, Table, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import config from '../../config.json';

const DMRDesc = (props) => {
  const data = props.searchDetails;
  const [inputList, setInputList] = useState(data);
  const handleSubmit = (e) => {
    console.log('DMR DESC', data);
    e.preventDefault(data.ponumber);
    axios
      .patch(`${config.SERVER_URL}poDetails/${data.ponumber}`, data.details)
      .then((res) => {
        console.log('Response', res);
        if (res.status === 200) {
          toast.success('Data Updated Successfully.');
        }
        //;
      })
      .catch((err) => {
        toast.error('Data Not Updated.');
        console.log(err);
      });
  };
  return (
    <div className='container-table100 ' style={{ justifyContent: 'center' }}>
      <div className='wrap-table100'>
        <div className='table'>
          <div className='rowo header'>
            <div className='cell'></div>
            <div className='cell'>PO Number</div>
            <div className='cell'>PO Name</div>
            <div className='cell'>Project Name</div>
            <div className='cell'>Date</div>
          </div>
          <div className='rowo'>
            <div className='cell'></div>
            <div className='cell' data-title='PO Number'>
              {data.ponumber}
            </div>
            <div className='cell' data-title='PO Name'>
              {data.poname}
            </div>
            <div className='cell' data-title='Project Name'>
              {data.projectName}
            </div>
            <div className='cell' data-title='Date'>
              {data.date}
            </div>
          </div>
        </div>
      </div>
      {data.details?.map((elementInArray, index) => {
        return (
          <Row
            key={index}
            className=''
            style={{ display: 'block', marginTop: '2rem', width: '100%' }}
          >
            <Row style={{ margin: '0', width: '100%', padding: '0' }}>
              <Col className='form__group field' style={{ maxWidth: '4rem' }}>
                <input
                  className='text-input form__field'
                  type='text'
                  name='index'
                  id='index'
                  value={index + 1}
                  disabled
                />
                <label htmlFor='index' className='form__label'>
                  S.No.
                </label>
              </Col>
              <Col className='form__group field'>
                <input
                  className='text-input form__field'
                  type='text'
                  name='description'
                  id='description'
                  value={elementInArray.description}
                  onChange={(e) => {
                    elementInArray.description = e.target.value;
                    setInputList({ ...inputList });
                  }}
                  required
                  aria-required
                />
                <label htmlFor='description' className='form__label'>
                  Product
                </label>
              </Col>
              <Col className='form__group field'>
                <input
                  className='text-input form__field'
                  type='currency'
                  name='amount'
                  id='amount'
                  value={elementInArray.amount}
                  onChange={(e) => {
                    elementInArray.amount = e.target.value;
                    setInputList({ ...inputList });
                  }}
                  required
                  aria-required
                />
                <label htmlFor='amount' className='form__label'>
                  Amount
                </label>
              </Col>
            </Row>
            <Row
              className='mt-3'
              style={{ margin: '0', width: '100%', padding: '0' }}
            >
              <Col className='form__group field'>
                <input
                  className='text-input form__field'
                  type='currency'
                  name='raisedAmount'
                  id='raisedAmount'
                  value={elementInArray.raisedAmount}
                  onChange={(e) => {
                    elementInArray.raisedAmount = e.target.value;
                    setInputList({ ...inputList });
                  }}
                  required
                  aria-required
                />
                <label htmlFor='raisedAmount' className='form__label'>
                  Raised Amount
                </label>
              </Col>
              <Col className='form__group field'>
                <input
                  className='text-input form__field'
                  type='number'
                  name='dmrNo'
                  id='dmrNo'
                  value={elementInArray.dmrNo}
                  onChange={(e) => {
                    elementInArray.dmrNo = e.target.value;
                    setInputList({ ...inputList });
                  }}
                  required
                  aria-required
                />
                <label htmlFor='dmrNO' className='form__label'>
                  DMR No.
                </label>
              </Col>
              <Col className='form__group field'>
                <input
                  className='text-input form__field'
                  name='date'
                  id='date'
                  type='date'
                  value={elementInArray.date}
                  onChange={(e) => {
                    elementInArray.date = e.target.value;
                    setInputList({ ...inputList });
                  }}
                  required
                  aria-required
                />
                <label htmlFor='amount' className='form__label'>
                  Date
                </label>
              </Col>
            </Row>
            <div className=' justify-content-between mt-3'>
              <button
                type='submit'
                className='mx-auto col-md-6 submitBtn btn btn-outline-dark'
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </Row>
        );
      })}
    </div>
  );
};

export default DMRDesc;
