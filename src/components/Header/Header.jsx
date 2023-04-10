import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Header = ({ links }) => {
  const [expanded, setExpanded] = useState(false);

  return (
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
        onClick={() => setExpanded(!expanded)}
      />
      <Navbar.Collapse id='navbarSupportedContent'>
        <Nav className='mr-auto ms-2'>
          {links.map((link) => (
            <Nav.Link
              key={link.to}
              as={NavLink}
              to={link.to}
              href={link.to}
              onClick={() => setExpanded(false)}
            >
              {link.label}
            </Nav.Link>
          ))}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
