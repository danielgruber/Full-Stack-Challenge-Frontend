import React from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import {
    Routes,
    Route,
    Link,
    useNavigate,
    useLocation,
    Navigate,
    Outlet
  } from "react-router-dom";
import commerceAPI from '../../api/commerceAPI';
import UserRole from '../../model/UserRole';

function Login() {
    const [showRegister, setShowRegister] = React.useState(false);
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [role, setRole] = React.useState(UserRole.Buyer);
    const roles = [UserRole.Buyer, UserRole.Seller];
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const navigate = useNavigate();

    const submitForm = (forceLogin: boolean = false) => {
        if (showRegister == false || forceLogin) {
            setLoading(true);
            commerceAPI.authenticate(username, password).then(() => {
                navigate("/");      

                setLoading(false);
            }).catch((reason) => {
                console.log(reason)
                setError(reason.toString())

                setLoading(false);
            });
        } else {
            setLoading(true);
            commerceAPI.createAccount(username, password, role).then(() => {
                setShowRegister(false);

                submitForm(true);
            }).catch((reason) => {
                console.log(reason)
                setError(reason.toString())

                setLoading(false);
            });
        }

        return false;
    }

    return (
        <div className="Login">
            <Container className="p-4 w-50">
                <Form onSubmit={(e) => { e.preventDefault(); submitForm() }}>
                    {error != "" ? <Alert key="err" variant="danger">{error}</Alert> : ""}
                    
                    <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control disabled={loading} type="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control disabled={loading} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                    </Form.Group>

                    <Form.Group className="mb-3" hidden={!showRegister} controlId="formBasicPassword">
                        <Form.Label>Role</Form.Label>
                        <Form.Select disabled={loading} aria-label="Select User Role">
                            {roles.map((role: UserRole) => 
                                <option key={role} value={role}>{role}</option>
                            )};
                        </Form.Select>
                    </Form.Group>

                    <Button disabled={loading} variant="primary" type="submit" className="m-1">
                        { showRegister ? "Register & Login" : "Login" }
                    </Button>

                    <a onClick={() => setShowRegister(!showRegister)} className="m-1">
                        { !showRegister ? "Register" : "Login instead" }
                    </a>
                </Form>
            </Container>
        </div>
    );
}

export default Login;
