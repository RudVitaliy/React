import React from "react";
import Card from "react-bootstrap/Card";
import '../App.css';

function Recipe(props) {
  return (
    <Card className="card">
      <Card.Body className="card-body">
        <Card.Title className="card-title">{props.recipe.name}</Card.Title>
        <Card.Img className="cardImg" variant="top" src={props.recipe.imgUri} alt={props.recipe.name} />
        <Card.Text className="card-text">{props.recipe.description}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Recipe;