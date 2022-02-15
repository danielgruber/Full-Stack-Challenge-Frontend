import React, { useEffect, useState } from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import {
  Routes,
  Route,
  useLocation,
  Navigate
} from "react-router-dom";
import './App.css';
import Login from '../Login/Login';
import VendingMachine from '../VendingMachine/VendingMachine';
import commerceAPI from '../../api/commerceAPI';
import useLoggedInUser from '../../api/userEffect'
import User from '../../model/User';
import Products from '../Products/Products';

function RequireAuth({ children, user }: { children: JSX.Element, user: User|null }) {
  const location = useLocation()

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  const location = useLocation()
  const user = useLoggedInUser()

  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">Vending Machine</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link hidden={user?.role != "BUYER"} href="/vending">Vending Machine</Nav.Link>
              <Nav.Link hidden={user?.role != "SELLER"} href="/products">Products</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Nav.Item hidden={!user} className="ml-auto">
            <span>Hello, {user?.username}</span>
          </Nav.Item>
          <Nav.Item hidden={!user} className="ml-auto">
            <Nav.Link onClick={() => commerceAPI.logout()}>Logout</Nav.Link>
          </Nav.Item>
        </Container>
      </Navbar>
      <div className="Body">
        <Routes>
          <Route path="/" element={<Navigate to={user?.role == "SELLER" ? "/products" : "/vending"} state={{ from: location }} replace />} />
          <Route path="/login" element={<Login user={user} />} />
          <Route
            path="/vending"
            element={
              <RequireAuth user={user}>
                <VendingMachine user={user} />
              </RequireAuth>
            }
          />
          <Route
            path="/products"
            element={
              <RequireAuth user={user}>
                <Products user={user} />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </div>
  )
}

export default App
