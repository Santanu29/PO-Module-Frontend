import { useEffect, useState, useRef } from 'react';
import { Form, Card, Container } from 'react-bootstrap';
import PoDetails from './PoDetails';

const UploadPo = () => {
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  // Handle file selection
  const handleOnChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setFile(file);
  };

  // Handle file reset
  const handleReset = () => {
    setFileName('');
    setFile(null);
    fileRef.current.value = '';
  };

  // Set document title on mount
  useEffect(() => {
    document.title = 'Home';
  }, []);

  return (
    <Container>
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
                onChange={handleOnChange}
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
    </Container>
  );
};

export default UploadPo;
