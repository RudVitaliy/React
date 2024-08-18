import React from "react";
import Recipe from "./Recipe";

function RecipeTableList(props) {
    function getRecipeList(recipeList) {
        return recipeList?.map((recipe) => {
            return <Recipe key={recipe.id} recipe={recipe} isFullDescription={props.isFullDescription} />;
        });
    }

    return (
        <div>
            {getRecipeList(props.recipeList)}
        </div>
    );
}

export default RecipeTableList;