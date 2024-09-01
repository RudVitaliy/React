import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import '../App.css';

const formatIngredient = (ingredient, amount, unit) => {
  return `${amount} ${unit} ${ingredient.name}`;
};

function Recipe({ recipe, isFullDescription, onEditRecipe }) {
  const { name, imgUri, description, ingredients: ingredientData } = recipe;
  const [ingredients, setIngredients] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const shortDescription = description.length > 100 ? description.substring(0, 100) + "..." : description;

  React.useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const fetchedIngredients = await Promise.all(
          ingredientData.map(async (ingredient) => {
            const response = await fetch(`http://localhost:8000/ingredient/get?id=${ingredient.id}`);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const ingredientDetails = await response.json();
            console.log('Fetched ingredient details:', ingredientDetails); 
            return {
              ...ingredientDetails,
              amount: ingredient.amount,
              unit: ingredient.unit
            };
          })
        );
        console.log('Fetched ingredients:', fetchedIngredients); 
        setIngredients(fetchedIngredients);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, [ingredientData]);

  return (
    <Card className="card">
      <Card.Body className="card-body">
        <Card.Title className="card-title">{name}</Card.Title>
        <Card.Img className="cardImg" variant="top" src={imgUri} alt={name} />
        <Card.Text className="card-text">
          {isFullDescription ? description : shortDescription}
        </Card.Text>
        {loading ? (
          <div>Loading ingredients...</div>
        ) : error ? (
          <div>Error loading ingredients: {error.message}</div>
        ) : ingredients.length > 0 ? (
          <div className="ingredients-list">
            <h5>Ingredients:</h5>
            <ul>
              {ingredients.map((ingredient, index) => (
                <li key={index}>
                  {formatIngredient(ingredient, ingredient.amount, ingredient.unit)}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>No ingredients available</div>
        )}
        <Button variant="secondary" onClick={() => onEditRecipe(recipe)}>
          Edit
        </Button>
      </Card.Body>
    </Card>
  );
}

export default Recipe;
