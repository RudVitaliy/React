import React, { useState, useMemo } from "react";
import '../App.css';
import RecipesGridList from "./RecipesGridList";
import RecipesTableList from "./RecipesTableList";
import ViewSwitcher from "./ViewSwitcher";
import SearchForm from "./SearchForm";

function RecipeList(props) {
    const [viewType, setViewType] = useState("grid");
    const [isFullDescription, setIsFullDescription] = useState(false);
    const [searchBy, setSearchBy] = useState("");

    const filteredRecipeList = useMemo(() => {
        return props.recipeList.filter((item) => {
            return (
                item.name.toLowerCase().includes(searchBy.toLowerCase()) ||
                item.description.toLowerCase().includes(searchBy.toLowerCase())
            );
        });
    }, [searchBy, props.recipeList]);

    return (
        <div>
            <ViewSwitcher 
                viewType={viewType} 
                setViewType={setViewType} 
                isFullDescription={isFullDescription} 
                setIsFullDescription={setIsFullDescription} 
            />
            <SearchForm setSearchBy={setSearchBy} />
            {viewType === "grid" ? (
                <RecipesGridList recipeList={filteredRecipeList} isFullDescription={isFullDescription} />
            ) : (
                <RecipesTableList recipeList={filteredRecipeList} isFullDescription={isFullDescription} />
            )}
        </div>
    );
}

export default RecipeList;
