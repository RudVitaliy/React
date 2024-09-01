import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Icon from '@mdi/react';
import { mdiLoading, mdiAlertOctagonOutline } from '@mdi/js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [recipeLoadCall, setRecipeLoadCall] = useState({
    state: 'pending',
    data: [],
  });
  let navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:8000/recipe/list', {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const responseJson = await response.json();
        setRecipeLoadCall({ state: 'success', data: responseJson });
      } catch (error) {
        setRecipeLoadCall({ state: 'error', error });
      }
    };

    fetchRecipes();
  }, []);

  function getRecipeListDropdown() {
    switch (recipeLoadCall.state) {
      case 'pending':
        return (
          <Nav.Link disabled>
            <Icon size={1} path={mdiLoading} spin /> Loading Recipes...
          </Nav.Link>
        );
      case 'success':
        return (
          <NavDropdown title="Select Recipe" id="navbarScrollingDropdown">
            {recipeLoadCall.data.map((recipe) => (
              <NavDropdown.Item
                key={recipe.id}
                onClick={() => navigate(`/recipeDetail/${recipe.id}`)}
              >
                {recipe.name}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
        );
      case 'error':
        return (
          <Nav.Link disabled>
            <Icon size={1} path={mdiAlertOctagonOutline} /> Error loading recipes
          </Nav.Link>
        );
      default:
        return null;
    }
  }

  return (
    <div className="App">
      <Navbar fixed="top" expand="sm" className="mb-3" bg="dark" variant="dark">
        <Container fluid>
          <Navbar.Brand onClick={() => navigate("/")}>Recipe Book</Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar-expand-sm" />
          <Navbar.Offcanvas id="offcanvasNavbar-expand-sm">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel-expand-sm">
                Recipe Book
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                {getRecipeListDropdown()}
                <Nav.Link onClick={() => navigate("/recipeList")}>
                  All Recipes
                </Nav.Link>
                <Nav.Link onClick={() => navigate("/ingredientList")}>
                  Ingredients
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      <Outlet context={{ recipes: recipeLoadCall.data }} />
    </div>
  );
}

export default App;
