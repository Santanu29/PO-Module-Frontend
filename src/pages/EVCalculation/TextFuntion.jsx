//COde with error handling and validations

import React, { useState, useRef } from 'react';
import { Table, Button, Card, Alert } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import axios from 'axios';

const EnEVCalculation = () => {
  const [data, setData] = useState([]);
  const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);
  const [workbook, setWorkbook] = useState(null);
  const [fileError, setFileError] = useState('');
  const [dataError, setDataError] = useState('');
  const [validationError, setValidationError] = useState('');
  const inputFileRef = useRef(null);

  const handleFileUpload = (e) => {
    e.preventDefault();
    setFileError('');
    setDataError('');
    setValidationError('');
    try {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        setWorkbook(workbook);
        const worksheetNames = workbook.SheetNames;
        const selectedWorksheet =
          workbook.Sheets[worksheetNames[selectedSheetIndex]];
        const sheetData = XLSX.utils.sheet_to_json(selectedWorksheet, {
          header: 1,
          raw: false,
          dateNF: 'yyyy-mm-dd',
          cellDates: true,
        });
        // Loop through each row in the sheetData and replace empty values with 0 for a particular row
        const modifiedSheetData = sheetData.map((row, index) => {
          if (index === 2) {
            // Replace empty values with 0 for row at index 2
            return row.map((cell) => (cell === '' ? 0 : cell));
          }
          return row;
        });
        // Validate data
        const numCols = modifiedSheetData[0].length;
        const isValid = modifiedSheetData.every(
          (row) => row.length === numCols,
        );
        if (!isValid) {
          setValidationError('Invalid data format.');
        } else {
          setData(modifiedSheetData);
        }
      };
      reader.readAsBinaryString(file);
    } catch (error) {
      setFileError('Error reading file. Please select a valid Excel file.');
    }
  };

  const handleSelectChange = (event) => {
    setSelectedSheetIndex(event.target.value);
    const worksheetNames = workbook.SheetNames;
    const selectedWorksheet =
      workbook.Sheets[worksheetNames[event.target.value]];
    const sheetData = XLSX.utils.sheet_to_json(selectedWorksheet, {
      header: 1,
      raw: false,
      dateNF: 'yyyy-mm-dd',
      cellDates: true,
    });
    setData(sheetData);
  };

  const handleRemoveFile = () => {
    setData([]);
    setWorkbook(null);
    setFileError('');
    setDataError('');
    setValidationError('');
    inputFileRef.current.value = null;
  };

  const handleSubmit = async () => {
    if (data.length === 0) {
      setDataError('No data to submit.');
      return;
    }
    try {
      const response = await axios.post('/api/submit-sheet-data', { data });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {fileError && <Alert variant='danger'>{fileError}</Alert>}
      <Card>
        <Card.Body>
          <Card.Title>Upload Excel file</Card.Title>
          <input type='file' onChange={handleFileUpload} ref={inputFileRef} />
        </Card.Body>
      </Card>
      {data.length > 0 && (
        <div>
          <Button variant='danger' size='sm' onClick={handleRemoveFile}>
            Remove file
          </Button>{' '}
          <label>Select sheet:</label>{' '}
          <select value={selectedSheetIndex} onChange={handleSelectChange}>
            {workbook.SheetNames.map((sheetName, index) => (
              <option key={index} value={index}>
                {sheetName}
              </option>
            ))}
          </select>
          <br />
          {validationError && <Alert variant='danger'>{validationError}</Alert>}
          <div className='table-responsive'>
            <Table striped bordered hover>
              <thead>
                <tr>
                  {data[0].map((cell, index) => (
                    <th key={index}>
                      {typeof cell === 'number' ? cell.toLocaleString() : cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {typeof cell === 'number'
                          ? cell.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 5,
                            })
                          : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {dataError && <Alert variant='warning'>{dataError}</Alert>}
          <Button variant='primary' onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      )}
    </div>
  );
};

export default EnEVCalculation;

//Code with remove file
// import React, { useState, useRef } from 'react';
// import { Table, Button, Card } from 'react-bootstrap';
// import * as XLSX from 'xlsx';
// import axios from 'axios';

// const EnEVCalculation = () => {
//   const [data, setData] = useState([]);
//   const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);
//   const [workbook, setWorkbook] = useState(null);
//   const inputFileRef = useRef(null);

//   const handleFileUpload = (e) => {
//     e.preventDefault();
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const workbook = XLSX.read(event.target.result, { type: 'binary' });
//       setWorkbook(workbook);
//       const worksheetNames = workbook.SheetNames;
//       const selectedWorksheet =
//         workbook.Sheets[worksheetNames[selectedSheetIndex]];
//       const sheetData = XLSX.utils.sheet_to_json(selectedWorksheet, {
//         header: 1,
//         raw: false,
//         dateNF: 'yyyy-mm-dd',
//         cellDates: true,
//       });
//       const modifiedSheetData = sheetData.map((row, index) => {
//         if (index === 2) {
//           return row.map((cell) => (cell === '' ? 0 : cell));
//         }
//         return row;
//       });
//       setData(modifiedSheetData);
//     };
//     reader.readAsBinaryString(file);
//   };

//   const handleSelectChange = (event) => {
//     setSelectedSheetIndex(event.target.value);
//     const worksheetNames = workbook.SheetNames;
//     const selectedWorksheet =
//       workbook.Sheets[worksheetNames[event.target.value]];
//     const sheetData = XLSX.utils.sheet_to_json(selectedWorksheet, {
//       header: 1,
//       raw: false,
//       dateNF: 'yyyy-mm-dd',
//       cellDates: true,
//     });
//     setData(sheetData);
//   };
//   const handleRemoveFile = () => {
//     setData([]);
//     setWorkbook(null);
//     inputFileRef.current.value = null;
//   };
//   const handleSubmit = async () => {
//     try {
//       const response = await axios.post('/api/submit-sheet-data', { data });
//       console.log(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   return (
//     <div>
//       <Card>
//         <Card.Body>
//           <Card.Title>Upload Excel file</Card.Title>
//           <input type='file' onChange={handleFileUpload} ref={inputFileRef} />
//         </Card.Body>
//       </Card>
//       {data.length > 0 && (
//         <div className='my-5'>
//           <Button variant='danger' size='sm' onClick={handleRemoveFile}>
//             Remove file
//           </Button>{' '}
//           <label className='mx-3'>Select sheet:</label>
//           <select value={selectedSheetIndex} onChange={handleSelectChange}>
//             {workbook.SheetNames.map((sheetName, index) => (
//               <option key={index} value={index}>
//                 {sheetName}
//               </option>
//             ))}
//           </select>
//           <br />
//           <div className='table-responsive'>
//             <Table striped bordered hover>
//               <thead>
//                 <tr>
//                   {data[0].map((cell, index) => (
//                     <th key={index}>
//                       {typeof cell === 'number' ? cell.toLocaleString() : cell}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.slice(1).map((row, rowIndex) => (
//                   <tr key={rowIndex}>
//                     {row.map((cell, cellIndex) => (
//                       <td
//                         key={cellIndex}
//                         style={{
//                           whiteSpace: 'nowrap',
//                           overflow: 'hidden',
//                           textOverflow: 'ellipsis',
//                         }}
//                       >
//                         {typeof cell === 'number'
//                           ? cell.toLocaleString(undefined, {
//                               minimumFractionDigits: 2,
//                               maximumFractionDigits: 5,
//                             })
//                           : cell}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//           <Button variant='primary' onClick={handleSubmit}>
//             Submit
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EnEVCalculation;

// import React, { useState } from 'react';
// import { Table, Button } from 'react-bootstrap';
// import * as XLSX from 'xlsx';

// const EnEVCalculation = () => {
//   const [data, setData] = useState([]);
//   const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);
//   const [workbook, setWorkbook] = useState(null);

//   const handleFileUpload = (e) => {
//     e.preventDefault();
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const workbook = XLSX.read(event.target.result, { type: 'binary' });
//       setWorkbook(workbook);
//       const worksheetNames = workbook.SheetNames;
//       const selectedWorksheet =
//         workbook.Sheets[worksheetNames[selectedSheetIndex]];
//       const sheetData = XLSX.utils.sheet_to_json(selectedWorksheet, {
//         header: 1,
//         raw: false,
//         dateNF: 'yyyy-mm-dd',
//         cellDates: true,
//         cellStyles: true,
//       });

//       // Loop through each row in the sheetData and replace empty values with 0 for a particular row
//       const modifiedSheetData = sheetData.map((row, index) => {
//         if (index === 2) {
//           // Replace empty values with 0 for row at index 2
//           return row.map((cell) => (cell === '' ? 0 : cell));
//         }
//         return row;
//       });

//       setData(modifiedSheetData);
//     };
//     reader.readAsBinaryString(file);
//   };

//   const handleSelectChange = (event) => {
//     setSelectedSheetIndex(event.target.value);
//     const worksheetNames = workbook.SheetNames;
//     const selectedWorksheet =
//       workbook.Sheets[worksheetNames[event.target.value]];
//     const sheetData = XLSX.utils.sheet_to_json(selectedWorksheet, {
//       header: 1,
//       raw: false,
//       dateNF: 'yyyy-mm-dd',
//       cellDates: true,
//       cellStyles: true,
//     });
//     setData(sheetData);
//   };

//   // Function to extract styles from a cell object and apply them as inline styles
//   const getCellStyle = (cell) => {
//     let style = {};
//     if (cell && cell.s) {
//       if (cell.s.font) {
//         style = { ...style, fontWeight: cell.s.font.bold ? 'bold' : 'normal' };
//         style = {
//           ...style,
//           fontStyle: cell.s.font.italic ? 'italic' : 'normal',
//         };
//         style = {
//           ...style,
//           textDecoration: cell.s.font.underline ? 'underline' : 'none',
//         };
//       }
//       if (cell.s.fill) {
//         style = { ...style, backgroundColor: cell.s.fill.bgColor.rgb };
//       }
//       if (cell.s.border) {
//         style = { ...style, border: `1px solid ${cell.s.border.color.rgb}` };
//       }
//       if (cell.s.alignment) {
//         style = { ...style, textAlign: cell.s.alignment.horizontal };
//       }
//     }
//     return style;
//   };

//   return (
//     <div>
//       <input type='file' onChange={handleFileUpload} />
//       {data.length > 0 && (
//         <div>
//           <label>Select sheet:</label>{' '}
//           <select value={selectedSheetIndex} onChange={handleSelectChange}>
//             {workbook.SheetNames.map((sheetName, index) => (
//               <option key={index} value={index}>
//                 {sheetName}
//               </option>
//             ))}
//           </select>
//           <br />
//           <div className='table-responsive'>
//             <Table striped bordered hover>
//               <thead>
//                 <tr>
//                   {data[0].map((cell, index) => (
//                     <th key={index}>{cell}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.slice(1).map((row, rowIndex) => (
//                   <tr key={rowIndex}>
//                     {row.map((cell, cellIndex) => (
//                       <td
//                         key={cellIndex}
//                         style={getCellStyle(
//                           workbook.Sheets[
//                             workbook.SheetNames[selectedSheetIndex]
//                           ][
//                             XLSX.utils.encode_cell({
//                               c: cellIndex,
//                               r: rowIndex + 1,
//                             })
//                           ],
//                         )}
//                       >
//                         {cell}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EnEVCalculation;

//FInal COde

// import React, { useState, useRef } from 'react';
// import { Table, Button, Card } from 'react-bootstrap';
// import * as XLSX from 'xlsx';
// import axios from 'axios';

// const EnEVCalculation = () => {
//   const [data, setData] = useState([]);
//   const [selectedSheetIndex, setSelectedSheetIndex] = useState(0);
//   const [workbook, setWorkbook] = useState(null);
//   const inputFileRef = useRef(null);

//   const handleFileUpload = (e) => {
//     e.preventDefault();
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const workbook = XLSX.read(event.target.result, { type: 'binary' });
//       setWorkbook(workbook);
//       const worksheetNames = workbook.SheetNames;
//       const selectedWorksheet =
//         workbook.Sheets[worksheetNames[selectedSheetIndex]];
//       const sheetData = XLSX.utils.sheet_to_json(selectedWorksheet, {
//         header: 1,
//         raw: false,
//         dateNF: 'yyyy-mm-dd',
//         cellDates: true,
//       });

//       // Loop through each row in the sheetData and replace empty values with 0 for a particular row
//       const modifiedSheetData = sheetData.map((row, index) => {
//         if (index === 2) {
//           // Replace empty values with 0 for row at index 2
//           return row.map((cell) => (cell === '' ? 0 : cell));
//         }
//         return row;
//       });

//       setData(modifiedSheetData);
//     };
//     reader.readAsBinaryString(file);
//   };

//   const handleSelectChange = (event) => {
//     setSelectedSheetIndex(event.target.value);
//     const worksheetNames = workbook.SheetNames;
//     const selectedWorksheet =
//       workbook.Sheets[worksheetNames[event.target.value]];
//     const sheetData = XLSX.utils.sheet_to_json(selectedWorksheet, {
//       header: 1,
//       raw: false,
//       dateNF: 'yyyy-mm-dd',
//       cellDates: true,
//     });
//     setData(sheetData);
//   };

//   const handleRemoveFile = () => {
//     setData([]);
//     setWorkbook(null);
//     inputFileRef.current.value = null;
//   };

//   const handleSubmit = async () => {
//     try {
//       const response = await axios.post('/api/submit-sheet-data', { data });
//       console.log(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <Card>
//         <Card.Body>
//           <Card.Title>Upload Excel file</Card.Title>
//           <input type='file' onChange={handleFileUpload} ref={inputFileRef} />
//         </Card.Body>
//       </Card>
//       {data.length > 0 && (
//         <div>
//           <Button variant='danger' size='sm' onClick={handleRemoveFile}>
//             Remove file
//           </Button>{' '}
//           <label>Select sheet:</label>{' '}
//           <select value={selectedSheetIndex} onChange={handleSelectChange}>
//             {workbook.SheetNames.map((sheetName, index) => (
//               <option key={index} value={index}>
//                 {sheetName}
//               </option>
//             ))}
//           </select>
//           <br />
//           <div className='table-responsive'>
//             <Table striped bordered hover>
//               <thead>
//                 <tr>
//                   {data[0].map((cell, index) => (
//                     <th key={index}>
//                       {typeof cell === 'number' ? cell.toLocaleString() : cell}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.slice(1).map((row, rowIndex) => (
//                   <tr key={rowIndex}>
//                     {row.map((cell, cellIndex) => (
//                       <td
//                         key={cellIndex}
//                         style={{
//                           whiteSpace: 'nowrap',
//                           overflow: 'hidden',
//                           textOverflow: 'ellipsis',
//                         }}
//                       >
//                         {typeof cell === 'number'
//                           ? cell.toLocaleString(undefined, {
//                               minimumFractionDigits: 2,
//                               maximumFractionDigits: 5,
//                             })
//                           : cell}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//           <Button variant='primary' onClick={handleSubmit}>
//             Submit
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EnEVCalculation;
