import RecipeList from './bricks/RecipeList';
import 'bootstrap/dist/css/bootstrap.min.css';
import recipeList from '../src/recipes.json';

function App() {
  return (
    <div>
      <RecipeList recipeList={recipeList}/>
    </div>
  );
}

export default App;