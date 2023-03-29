import { Nav, Navbar } from 'react-bootstrap';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Header = (props) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <Navbar
        expand='lg'
        style={{ background: 'black' }}
        variant='dark'
        expanded={expanded}
      >
        <Navbar.Brand className='p-3' href='/'>
          Purchase Order
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls='navbarSupportedContent'
          onClick={() => setExpanded(expanded ? false : true)}
        />
        <Navbar.Collapse id='navbarSupportedContent'>
          <Nav className='mr-auto ms-2'>
            <Nav.Link as={NavLink} to='/' onClick={() => setExpanded(false)}>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to='/evc' onClick={() => setExpanded(false)}>
              EV Calculation
            </Nav.Link>
            <Nav.Link as={NavLink} to='/dmr' onClick={() => setExpanded(false)}>
              Raise DMR
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to='/about'
              onClick={() => setExpanded(false)}
            >
              About Us
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default Header;
