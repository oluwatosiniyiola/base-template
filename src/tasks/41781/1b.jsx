import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Button,
  Select,
  SelectItem,
  Rating,
} from "@/components/ui";
import { cn } from "@/lib/utils";

function RecipeCard({ recipe, onRate }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{recipe.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Ingredients:</strong> {recipe.ingredients}
        </p>
        <p>
          <strong>Steps:</strong> {recipe.steps}
        </p>
      </CardContent>
      <CardFooter>
        <Rating
          value={recipe.rating}
          onChange={(value) => onRate(recipe.id, value)}
          max={5}
        />
      </CardFooter>
    </Card>
  );
}

function RecipeForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, ingredients, steps, rating: 0, id: Date.now() });
    setTitle("");
    setIngredients("");
    setSteps("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <Input
        type="text"
        placeholder="Recipe Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="mb-2"
      />
      <Input
        type="text"
        placeholder="Ingredients (comma separated)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        required
        className="mb-2"
      />
      <Input
        type="text"
        placeholder="Preparation Steps"
        value={steps}
        onChange={(e) => setSteps(e.target.value)}
        required
      />
      <Button type="submit" className="mt-4">
        Add Recipe
      </Button>
    </form>
  );
}

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [view, setView] = useState("grid");
  const [filterRating, setFilterRating] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const handleNewRecipe = (recipe) => {
    setRecipes([...recipes, recipe]);
  };

  const handleRate = (id, rating) => {
    setRecipes(recipes.map((r) => (r.id === id ? { ...r, rating } : r)));
  };

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.rating >= filterRating &&
      (recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6">Recipe Share</h1>
      <RecipeForm onSubmit={handleNewRecipe} />

      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search recipes..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/2 sm:w-1/3"
        />
        <Select onValueChange={setFilterRating} defaultValue={0}>
          <SelectItem value={0}>All Ratings</SelectItem>
          {[1, 2, 3, 4, 5].map((r) => (
            <SelectItem key={r} value={r}>
              {r} Star & Up
            </SelectItem>
          ))}
        </Select>
        <div className="flex gap-2">
          <Button onClick={() => setView("grid")}>Grid</Button>
          <Button onClick={() => setView("list")}>List</Button>
        </div>
      </div>

      <div
        className={cn(
          "grid gap-4",
          view === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "flex flex-col"
        )}
      >
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} onRate={handleRate} />
        ))}
      </div>
    </div>
  );
}
