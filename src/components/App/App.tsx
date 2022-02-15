import React, { useState } from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet
} from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Login from '../Login/Login';
import VendingMachine from '../VendingMachine/VendingMachine';
import commerceAPI from '../../api/commerceAPI';
import { useIsLoggedIn } from '../../api/loginEffect';

function RequireAuth({ children }: { children: JSX.Element }) {
  const isLoggedIn = useIsLoggedIn();
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  const isLoggedIn = useIsLoggedIn();
  const location = useLocation()

  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">Vending Machine</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/vending">Vending Machine</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Nav.Item hidden={!isLoggedIn} className="ml-auto">
            
          </Nav.Item>
          <Nav.Item hidden={!isLoggedIn} className="ml-auto">
            <Nav.Link onClick={() => commerceAPI.logout()}>Logout</Nav.Link>
          </Nav.Item>
        </Container>
      </Navbar>
      <div className="Body">
        <Routes>
          <Route path="/" element={<Navigate to="/vending" state={{ from: location }} replace />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/vending"
            element={
              <RequireAuth>
                <VendingMachine />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </div>
  )
}

export default App
