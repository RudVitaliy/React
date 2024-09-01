import React from "react";
import Recipe from "./Recipe";

function RecipeTableList({ recipeList, isFullDescription, onEditRecipe }) {
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
        <div>
            {getRecipeList(recipeList)}
        </div>
    );
}

export default RecipeTableList;
