import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header/Header';
import EVCalculation from './pages/EVCalculation/EVCalculation';
import { Route, Routes } from 'react-router-dom';
import UploadPo from './pages/Home/UploadPo';
import RaiseDMR from './pages/Raisedmr/RaiseDMR';
import EnEVCalculation from './pages/EVCalculation/EnEVCalculation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer />
      <Header />
      <Container
        style={{
          minHeight: '90vh',
          overflow: 'auto',
        }}
      >
        <Routes>
          <Route path='/' element={<UploadPo />} />
          <Route path='/evc' element={<EVCalculation />} />
          <Route path='/eevc' element={<EnEVCalculation />} />
          <Route path='/dmr' element={<RaiseDMR />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
