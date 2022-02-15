import React, { useEffect } from 'react'
import { Alert, Button, Col, Container, Form } from 'react-bootstrap'
import { useNavigate } from "react-router-dom";
import commerceAPI from '../../api/commerceAPI'
import Product from '../../model/Product'
import User from '../../model/User'

function VendingMachine({ user }: { user: User|null }) {
  const [products, setProducts] = React.useState<Array<Product>|null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [bought, setBought] = React.useState("")
  const [amount, setAmount] = React.useState(1)
  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController()
    if (user && user?.role == "BUYER") {
      setLoading(true)

      commerceAPI.fetchProducts(abortController.signal).then((products) => {
        setLoading(false)

        setProducts(products.data)
      })
    } else if (user?.role == "SELLER") {
      navigate("/products")
    } else {
      navigate("/login")
    }

    return () => abortController.abort()
  }, [user, bought])

  const depositCoin = (coin: number) => {
    if (user) {
      setLoading(true)

      commerceAPI.deposit([coin]).then((userResponse) => {
        setLoading(false)

        commerceAPI.user = userResponse.data
      }).catch(reason => {
        setLoading(false)

        setError(reason.toString())
      })
    }
  }

  const buy = (product: Product) => {
    if (user) {
      setLoading(true)
      setError("")
      setBought("")

      commerceAPI.buy(product.id!, amount).then((response) => {
        setLoading(false)

        setBought("Successfully bought Product "+response.data.product.productName+". Change: " + 
        JSON.stringify(response.data.change) +
        " Number of Items: " + response.data.numberOfProduct +
        " Total Amount: " + response.data.total)

        commerceAPI.currentUser()

      }).catch(reason => {
        setLoading(false)
        setError(reason.toString())
      })
    }
  }

  return (
    <div className="VendingMachine">
      <Container className="p-5">
        <h1>Vending machine</h1>

        {error != "" ? <Alert key="err_vending" variant="danger">{error}</Alert> : ""}
        {bought != "" ? <Alert key="bought" variant="success">{bought}</Alert> : ""}

        <p>You need to first deposit coins in order to buy products.</p>
        <p>Current coins deposited: {user?.depositCents}</p>

        <Form className="p-2" onSubmit={(e) => { e.preventDefault() }}>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Button disabled={loading} variant="primary" onClick={() => depositCoin(5)} type="button" className="m-1">
                  Deposit 5
                </Button>
                <Button disabled={loading} variant="primary" onClick={() => depositCoin(10)} type="button" className="m-1">
                  Deposit 10
                </Button>
                <Button disabled={loading} variant="primary" onClick={() => depositCoin(20)} type="button" className="m-1">
                  Deposit 20
                </Button>
                <Button disabled={loading} variant="primary" onClick={() => depositCoin(50)} type="button" className="m-1">
                  Deposit 50
                </Button>
                <Button disabled={loading} variant="primary" onClick={() => depositCoin(100)} type="button" className="m-1">
                  Deposit 100
                </Button>
            </Form.Group>
        </Form>

        <h2>Buy Product</h2>

        <Container>
          {products?.length == 0 ? <div className="p-5">No Products available</div> : ""}
          {products?.map(product => {
            return <Container key={"product_" + product.id} className="product">
              <h4>{product.productName}</h4>
              <p>Cost: {product.cost}</p>
              <p>Available: {product.amountAvailable}</p>

              <Form onSubmit={(e) => { e.preventDefault(); buy(product) }}>
                <Form.Control disabled={loading} type="amount" value={amount} onChange={e => setAmount(+e.target.value)} placeholder={"Enter Amount (Min. 1, Max. " + product.amountAvailable + ")"} />
                <Button disabled={loading} variant="primary" type="submit" className="m-1">
                  Buy Product
                </Button>
              </Form>
            </Container>
          })}
        </Container>

      </Container>
    </div>
  )
}

export default VendingMachine;
