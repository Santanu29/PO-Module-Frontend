import { ToastContainer } from 'react-toastify';
import Header from './components/Header';
import { Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import EvCalculation from './pages/EVC/EvCalculation';
import RaiseDMR from './pages/Raisedmr/RaiseDMR';
import './App.css';
import UploadPo from './pages/Home/UploadPo';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <ToastContainer />
      <Header />
      <div
        className='container'
        style={{
          minHeight: '90vh',
          overflow: 'auto',
        }}
      >
        <Routes>
          <Route path='/' element={<UploadPo />} />
          <Route path='/evc' element={<EvCalculation />} />
          <Route path='/dmr' element={<RaiseDMR />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
