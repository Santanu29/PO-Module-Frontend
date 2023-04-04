import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import DMRinputs from './DMRinputs';
import config from '../../config.json';
import DMRList from './DMRList';

const RaiseDMR = () => {
  const [id, setid] = useState('');
  const [show, setShow] = useState(true);
  const [found, setFound] = useState(true);
  const [detail, setdetails] = useState(null);
  const [po, setPo] = useState();
  const [sortType, setSortType] = useState('Default');

  // console.log('data from rdmr', data);
  useEffect(() => {
    document.title = 'Raise DMR';
    setShow(false);
    const fetchAllPO = () => {
      axios
        .get(`${config.SERVER_URL}getAllItems`)
        .then((d) => {
          if (sortType === 'Default') {
            let temp = d.data?.map((d, index) => ({ ...d, id: index + 1 }));
            setPo(temp);
          } else if (sortType === 'Oldest') {
            let temp = d.data
              ?.map((d, index) => ({
                ...d,
                id: index + 1,
              }))
              .sort((a, b) => {
                return a.date
                  .split('-')
                  .join()
                  .localeCompare(b.date.split('-').join());
              });
            setPo(temp);
          } else if (sortType === 'Latest') {
            let temp = d.data
              ?.map((d, index) => ({
                ...d,
                id: index + 1,
              }))
              .sort((a, b) => {
                return b.date
                  .split('-')
                  .join()
                  .localeCompare(a.date.split('-').join());
              });
            setPo(temp);
          }
          // toast.success('Data Found');
          // let temp = d.data?.map((d, index) => ({ ...d, id: index + 1 }));

          // setPo(temp);
          // console.log('Po', temp);
        })
        .catch((err) => {
          toast.error('Data Not Found.');
        });
    };
    fetchAllPO();
    setid('');
    setdetails();
  }, [sortType]);

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
          console.log('aws', d.data);
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
      <div
        className='text-center my-4 files'
        style={{
          display: 'flex ',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          className='search'
          style={{
            width: ' 100%',
          }}
        >
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
          {/* <button
            className='btn btn-light'
            type='submit'
            onClick={handlesubmit}
          >
            Search
          </button> */}
        </div>
        <div className='dropdown btn btn-outline-dark'>
          <button
            className='btn dropdown-toggle'
            type='button'
            data-bs-toggle='dropdown'
            aria-expanded='false'
          >
            Sort By : {sortType}
          </button>
          <ul className='dropdown-menu dropdown-menu-light'>
            <li>
              <button
                className='dropdown-item'
                onClick={() => setSortType('Latest')}
              >
                Latest
              </button>
            </li>
            <li>
              <button
                className='dropdown-item'
                onClick={() => setSortType('Oldest')}
              >
                Oldest
              </button>
            </li>
            <li>
              <button
                className='dropdown-item'
                onClick={() => setSortType('Default')}
              >
                None
              </button>
            </li>
          </ul>
        </div>
      </div>
      {/* <DMRList /> */}
      {!detail ? (
        <>
          <div className=''>
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
