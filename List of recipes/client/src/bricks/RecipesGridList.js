import React from "react";
import Recipe from "./Recipe";
import '../App.css';

function RecipeGridList({ recipeList, isFullDescription, onEditRecipe }) {
    function getRecipeList(recipeList) {
        return recipeList?.map((recipe) => {
            return (
                <Recipe
                    key={recipe.id}
                    recipe={recipe}
                    isFullDescription={isFullDescription}
                    onEditRecipe={onEditRecipe} 
                />
            );
        });
    }

    return (
        <div className="recipe-list">
            {getRecipeList(recipeList)}
        </div>
    );
}

export default RecipeGridList;
