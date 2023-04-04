import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config.json';
import DMRDesc from './DMRDesc';
import useTable from './useTable';
// import { rowo, div } from 'react-bootstrap';

const DMRList = (props) => {
  const data = props.poDetails;
  // console.log(temp);
  console.log(data);
  const [searchData, setSearchData] = useState();
  const [page, setPage] = useState(1);
  const { slice, range } = useTable(data, page, 7);
  const [isSorting, setIsSorting] = useState(false);

  useEffect(() => {
    if (isSorting === true) {
      console.log('Sorting');
    } else if (slice.length < 1 && page !== 1) {
      setPage(page - 1);
    }
  }, [slice, page, setPage]);

  const handlePODetails = (ponumber, e) => {
    e.preventDefault();
    axios
      .get(`${config.SERVER_URL}getdetails/${ponumber}`)
      .then((d) => {
        console.log(d.data);
        setSearchData(d.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //   const sortedCars1 = data.sort(
  //     (a, b) =>
  //       new Date(...a.date.split('-').reverse()) -
  //       new Date(...b.date.split('-').reverse()),
  //   );
  //   console.log('sortedCars1', sortedCars1);
  return (
    <div className='container-table100 '>
      <div className='wrap-table100'>
        {searchData ? (
          <>
            <button
              className='butn butn-one mb-3'
              onClick={() => setSearchData()}
            >
              <span> Go Back</span>
            </button>
            <DMRDesc searchDetails={searchData} />
          </>
        ) : (
          <>
            <div className='table'>
              <div className='rowo header'>
                <div className='cell'>S.No.</div>
                <div className='cell'>PO Number</div>
                <div className='cell'>PO Name</div>
                <div className='cell'>Project Name</div>
                <div className='cell'>Date</div>
                <div className='cell'></div>
              </div>

              {slice?.map((pData, index) => {
                return (
                  <div className='rowo' key={index}>
                    <div className='cell' data-title='S.No.'>
                      {pData.id}
                    </div>
                    <div className='cell' data-title='PO Number'>
                      {pData.ponumber}
                    </div>
                    <div className='cell' data-title='PO Name'>
                      {pData.poname}
                    </div>
                    <div className='cell' data-title='Project Name'>
                      {pData.projectName}
                    </div>
                    <div className='cell' data-title='Date'>
                      {pData.date}
                    </div>
                    <button
                      className='btn btn-outline-dark'
                      onClick={(e) => handlePODetails(`${pData.ponumber}`, e)}
                    >
                      View more.
                    </button>
                  </div>
                );
              })}
              {/* <div className='rowo'>
            <div className='cell' data-title='PO Number'>
              3243423
            </div>
            <div className='cell' data-title='PO Name'>
              PO Name2
            </div>
            <div className='cell' data-title='Project Name'>
              Project Name2
            </div>
            <div className='cell' data-title='Date'>
              12-02-2022
            </div>
          </div>
          <div className='rowo'>
            <div className='cell' data-title='PO Number'>
              987
            </div>
            <div className='cell' data-title='PO Name'>
              PO Name3
            </div>
            <div className='cell' data-title='Project Name'>
              Project Name3
            </div>
            <div className='cell' data-title='Date'>
              07-03-2022
            </div>
          </div> */}
            </div>
            <div className='tableFooter'>
              {range.map((el, i) => (
                <button
                  key={i}
                  className={`footerBTN ${
                    page === el ? 'activeFooterBTN' : 'inactiveFooterBTN'
                  }`}
                  onClick={() => setPage(el)}
                >
                  {el}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DMRList;
