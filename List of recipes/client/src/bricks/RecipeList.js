import React from "react";
import Recipe from "./Recipe";
import '../App.css';

function RecipeList(props) {
    function getRecipeList(recipeList) {
        return recipeList?.map((recipe) => {
            return <Recipe key={recipe.id} recipe={recipe} />;
        });
    }
    return (
        <div className="recipe-list">
            {getRecipeList(props.recipeList)}
        </div>
    );
}


export default RecipeList;