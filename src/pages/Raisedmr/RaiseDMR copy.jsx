import axios from 'axios';
import { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
import DMRinputs from './DMRinputs';
import config from '../../config.json';
import DMRList from './DMRList';

const RaiseDMR = () => {
  const [id, setid] = useState('');
  const [show, setShow] = useState(true);
  const [found, setFound] = useState(true);
  const [detail, setdetails] = useState(null);
  const [po, setPo] = useState();

  useEffect(() => {
    document.title = 'Raise DMR';
    setShow(false);
    const fetchAllPO = () => {
      axios
        .get(`${config.SERVER_URL}getAllItems`)
        .then((d) => {
          // toast.success('Data Found');
          setPo(d.data);
          console.log('Po', d.data);
        })
        .catch((err) => {
          toast.error('Data Not Found.');
        });
    };
    fetchAllPO();
    setid('');
    setdetails();
  }, []);

  const handlesubmit = (e, idNo) => {
    e.preventDefault();
    if (idNo.length === 0) {
      setdetails(null);
      setShow(false);
      console.log(!show);
    } else {
      setShow(true);
      axios
        .get(`${config.SERVER_URL}getdetails/${idNo}`)
        .then((d) => {
          setdetails(d.data);
        })
        .catch((err) => {
          setdetails();
          setFound(false);
        });
    }
  };

  return (
    <>
      <div className='text-center mt-3 files'>
        <div className='search'>
          <i className='fa fa-search' />
          <input
            type='text'
            className='form-control'
            placeholder='Enter PO number here.'
            value={id}
            onChange={(e) => {
              setid(e.target.value);
              handlesubmit(e, e.target.value);
            }}
          />
          <button
            className='btn btn-light'
            type='submit'
            onClick={handlesubmit}
          >
            Search
          </button>
        </div>
      </div>
      {/* <DMRList /> */}
      {!detail ? (
        <>
          <div className='pt-3'>
            {!found &&
              (show ? <h3 className='not-found'>No Data Found.</h3> : null)}

            {po && show === false ? (
              <DMRList poDetails={po} />
            ) : !po ? (
              <h2>Loading...</h2>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <div className='pt-3 mt-4'>
            <DMRinputs details={detail} />
          </div>
        </>
      )}
    </>
  );
};

export default RaiseDMR;
