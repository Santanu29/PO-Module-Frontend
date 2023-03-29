import { Form, InputGroup } from 'react-bootstrap';

const AddRows = ({ inputList, deleted, setInputList }) => {
  const { items } = inputList;
  return items.map((val, idx) => {
    let po_description = `po_description-${idx}`,
      amount = `amount-${idx}`;
    return (
      <InputGroup className='mb-3' key={val.index}>
        <InputGroup.Text>Product-${idx + 1}</InputGroup.Text>
        <Form.Control
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
        <InputGroup.Text>Amount</InputGroup.Text>
        <Form.Control
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
        <InputGroup.Text>
          <button
            title='d'
            onClick={(e) => deleted(idx)}
            type='button'
            className='btn btn-outline-danger'
          >
            <i className='fa fa-minus' aria-hidden='true' />
          </button>
        </InputGroup.Text>
      </InputGroup>
    );
  });
};

export default AddRows;
