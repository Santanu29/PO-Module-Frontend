import { useEffect, useState, useRef } from 'react';
import { Form, Card } from 'react-bootstrap';
import PoDetails from './PoForm/PoDetails';

const UploadPo = (props) => {
  // const [submitPdf, setSubmitPdf] = useState(false);
  const fileRef = useRef();
  const [file, setFile] = useState();
  const [fileName, setfileName] = useState();

  const handleOnChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setfileName(file.name);
    setFile(file);
    // setSubmitPdf(true);
    e.preventDefault();
  };

  const handleReset = (e) => {
    setFile();
    // setSubmitPdf(false);
    setfileName();
    fileRef.current.value = '';
  };

  useEffect(() => {
    document.title = 'Home';
  });

  return (
    <div className='container'>
      <Form>
        <Card className='text-center mt-3 files'>
          <Card.Header>Upload PO</Card.Header>
          <Card.Body>
            {!file && (
              <Card.Title>Please select Purchase Order file.</Card.Title>
            )}
            {file && <Card.Title>{fileName} uploaded successfully.</Card.Title>}
            <Card.Text>
              <input
                title='file'
                type='file'
                name='file'
                onChange={(e) => handleOnChange(e)}
                ref={fileRef}
                accept='.pdf'
                required
              />
              {file ? (
                <i className='fa fa-close' onClick={handleReset} />
              ) : null}
            </Card.Text>
          </Card.Body>
        </Card>
      </Form>
      {file && (
        <PoDetails file={file} fileName={fileName} handleReset={handleReset} />
      )}
    </div>
  );
};

export default UploadPo;
