import { Fragment, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header/Header';
import UploadPo from './pages/Home/UploadPo';
import EVCalculation from './pages/EVCalculation/EVCalculation';
import EnEVCalculation from './pages/EVCalculation/EnEVCalculation';
import EnEVC from './pages/EnEVC/EnEVC';
import RaiseDMR from './pages/Raisedmr/RaiseDMR';

import { ToastContainer } from 'react-toastify';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const validPaths = ['/evc', '/eevc', '/enevc', '/dmr', '/'];

  const links = [
    { to: '/', label: 'Home' },
    { to: '/evc', label: 'EV Calculation' },
    { to: '/dmr', label: 'Raise DMR' },
  ];

  useEffect(() => {
    if (!validPaths.includes(location.pathname)) {
      const timeout = setTimeout(() => {
        navigate('/');
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [location, navigate, validPaths]);

  return (
    <Fragment>
      <Header links={links} />;
      <Container className='mt-5'>
        <Routes>
          <Route path='/' element={<UploadPo />} />
          <Route path='/evc' element={<EnEVC />} />
          <Route path='/eevc' element={<EnEVCalculation />} />
          <Route path='/enevc' element={<EnEVC />} />
          <Route path='/dmr' element={<RaiseDMR />} />
          <Route
            path='*'
            element={
              <div>
                <h1>Error: Page not found</h1>
                <p>Redirecting to home page in 3 seconds...</p>
              </div>
            }
          />
        </Routes>
      </Container>
      <ToastContainer />
    </Fragment>
  );
}

export default App;
