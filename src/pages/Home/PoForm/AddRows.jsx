import { Col, Row } from 'react-bootstrap';

const AddRows = ({ inputList, deleted, setInputList }) => {
  const { items } = inputList;
  return items.map((val, idx) => {
    let po_description = `po_description-${idx}`,
      amount = `amount-${idx}`;
    return (
      <Row className='mb-3 ' key={val.index}>
        <Col className='form__group field'>
          <input
            className='text-input form__field'
            aria-label='Enter Product name'
            name='product'
            data-id={idx}
            required
            value={val.po_description}
            id={po_description}
            onChange={(e) => {
              val.po_description = e.target.value;
              setInputList({ ...inputList });
            }}
          />
          <label for='dater' class='form__label'>
            Product {idx + 1}
          </label>
        </Col>

        <Col className='form__group field count'>
          <>
            <input
              className='text-input form__field'
              type='number'
              aria-label='Enter Amount'
              name='amount'
              data-id={idx}
              required
              id={amount}
              value={val.amount}
              onChange={(e) => {
                val.amount = e.target.value;
                setInputList({ ...inputList });
              }}
            />
            <label for='dater' class='form__label'>
              Amount
            </label>
            <button
              title='d'
              onClick={(e) => deleted(idx)}
              type='button'
              className='btn btn-outline-danger'
            >
              <i className='fa fa-minus' aria-hidden='true' />
            </button>
          </>
        </Col>
      </Row>
    );
  });
};

export default AddRows;
