import { Table } from 'react-bootstrap';

const DataTable = ({ data, headers }) => {
  return (
    <div
      className='table-responsive'
      style={{ maxHeight: '90vh', overflow: 'scroll' }}
    >
      <Table striped bordered hover>
        <thead>
          <tr>
            {headers &&
              headers.map((cell, index) => (
                <th
                  key={index}
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {cell}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((numList, i) => (
            <tr key={i}>
              {headers &&
                headers.map((num, j) => (
                  <td
                    key={j}
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {numList[num]}
                  </td>
                ))}
            </tr>
          ))}
          {/* {data?.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row?.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))} */}
        </tbody>
      </Table>
    </div>
  );
};

export default DataTable;
