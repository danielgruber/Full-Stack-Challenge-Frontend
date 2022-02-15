import React, { useEffect } from 'react'
import { Alert, Button, Container, Form } from 'react-bootstrap'
import commerceAPI from '../../api/commerceAPI'
import { useIsLoggedIn } from '../../api/loginEffect'
import Product from '../../model/Product'
import User from '../../model/User'

function VendingMachine() {
  const isLoggedIn = useIsLoggedIn()
  const [user, setUser] = React.useState<User|null>(null)
  const [products, setProducts] = React.useState<Array<Product>|null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  useEffect(() => {
    const abortController = new AbortController()
    if (isLoggedIn) {
      setLoading(true)

      commerceAPI.currentUser(abortController.signal).then((user) => {
        setUser(user.data)
      })

      commerceAPI.fetchProducts(abortController.signal).then((products) => {
        setLoading(false)

        setProducts(products.data)
      })
    }

    return () => abortController.abort()
  }, [isLoggedIn])

  const depositCoins = () => {

  }

  return (
    <div className="VendingMachine">
      <Container className="p-2">
        <h1>Vending machine</h1>

        <span>Hello, {user?.username}</span>

        {error != "" ? <Alert key="err" variant="danger">{error}</Alert> : ""}

        <h2>Deposit Coins</h2>

        <Form onSubmit={(e) => { e.preventDefault(); depositCoins() }}>
    
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Coins</Form.Label>
                <Form.Select multiple={true} disabled={loading} aria-label="Select User Role">
                    
                </Form.Select>
            </Form.Group>

            <Button disabled={loading} variant="primary" type="submit" className="m-1">
                Deposit Coins
            </Button>
        </Form>

        <h2>Buy Product</h2>

      </Container>
    </div>
  )
}

export default VendingMachine;
