import React from 'react';
import { Alert, Button, Col, Container, Form } from 'react-bootstrap'
import commerceAPI from '../../api/commerceAPI';
import Product from '../../model/Product';
import User from "../../model/User";

function Products({ user }: { user: User|null }) {
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [product, setProduct] = React.useState<Product>({})

  const submitForm = () => {
    if (user && product.productName && product.cost && product.amountAvailable) {
      setError("")
      setSuccess("")
      
      commerceAPI.createProduct(product.productName, product.cost, product.amountAvailable).then( response => {
        setSuccess("Created product " + product.productName)

        setProduct({})

        return response
      }).catch(reason => setError(reason.toString()))
    }
  }
  
  return (<div>
    <Container className="p-5">
      <h1>Add Product</h1>

      <Form onSubmit={(e) => { e.preventDefault(); submitForm() }}>
          {error != "" ? <Alert key="err" variant="danger">{error}</Alert> : ""}
          {success != "" ? <Alert key="success" variant="success">{success}</Alert> : ""}
          
          <Form.Group className="mb-3" controlId="formBasicProductName">
              <Form.Label>Product Name</Form.Label>
              <Form.Control disabled={loading} type="name" value={product?.productName} onChange={e => setProduct({...product, productName: e.target.value})} placeholder="Enter product name" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formAmountAvailable">
              <Form.Label>Amount Available</Form.Label>
              <Form.Control disabled={loading} type="number" value={product?.amountAvailable} onChange={e => setProduct({...product, amountAvailable: parseInt(e.target.value)})} placeholder="Enter amount available" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCost">
              <Form.Label>Cost</Form.Label>
              <Form.Control disabled={loading} type="number" value={product?.cost} onChange={e => setProduct({...product, cost: parseInt(e.target.value)})} placeholder="Enter cost" />
          </Form.Group>

          <Button disabled={loading || !product.amountAvailable || !product.cost || !product.productName} variant="primary" type="submit" className="m-1">
              Create Product
          </Button>
      </Form>
    </Container>
  </div>)
}

export default Products;
