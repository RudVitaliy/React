import React, { useEffect, useState } from 'react';
import RecipeList from './bricks/RecipeList';
import 'bootstrap/dist/css/bootstrap.min.css';
import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js';
import './App.css';

function App() {
  const [recipeLoadCall, setRecipeLoadCall] = useState({
    state: 'pending',
    data: [],
  });

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

  function getContent() {
    switch (recipeLoadCall.state) {
      case 'pending':
        return (
          <div className="loading">
            <Icon size={2} path={mdiLoading} spin={true} />
          </div>
        );
      case 'success':
        return <RecipeList recipeList={recipeLoadCall.data} />;
      case 'error':
        return (
          <div className="error">
            <div>No recipes found</div>
            <br />
            <pre>{JSON.stringify(recipeLoadCall.error, null, 2)}</pre>
          </div>
        );
      default:
        return null;
    }
  }

  return <div>{getContent()}</div>;
}

export default App;
