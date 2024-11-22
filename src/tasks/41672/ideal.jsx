import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

const RecipePlatform = () => {
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({
    name: "",
    ingredients: [],
    steps: "",
    cookingTime: "",
    category: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [comments, setComments] = useState({});
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const ingredientsList = [
    "Tomato",
    "Onion",
    "Garlic",
    "Chicken",
    "Beef",
    "Rice",
    "Pasta",
    "Olive Oil",
    "Salt",
    "Pepper",
  ];
  const categories = [
    "Vegetarian",
    "Gluten-free",
    "Quick meals",
    "Dessert",
    "Breakfast",
  ];

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecipe({ ...newRecipe, [name]: value });
  };

  const handleIngredientSelect = (ingredient) => {
    if (!newRecipe.ingredients.includes(ingredient)) {
      setNewRecipe({
        ...newRecipe,
        ingredients: [...newRecipe.ingredients, ingredient],
      });
    }
  };

  const handleSubmitRecipe = () => {
    setRecipes([...recipes, { ...newRecipe, id: Date.now() }]);
    setNewRecipe({
      name: "",
      ingredients: [],
      steps: "",
      cookingTime: "",
      category: "",
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterToggle = (filter) => {
    setSelectedFilters(
      selectedFilters.includes(filter)
        ? selectedFilters.filter((f) => f !== filter)
        : [...selectedFilters, filter]
    );
  };

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedFilters.length === 0 ||
        selectedFilters.includes(recipe.category))
  );

  const handleAddComment = (recipeId, comment) => {
    setComments({
      ...comments,
      [recipeId]: [
        ...(comments[recipeId] || []),
        { text: comment, id: Date.now() },
      ],
    });
  };

  const handleStartTimer = (time) => {
    setTimer(time * 60);
    setIsTimerRunning(true);
  };

  const handleStopTimer = () => {
    setIsTimerRunning(false);
    setTimer(0);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Recipe Sharing Platform</h1>

      {/* Recipe Creation */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New Recipe</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            name="name"
            value={newRecipe.name}
            onChange={handleInputChange}
            placeholder="Recipe Name"
            className="mb-4"
          />
          <Select
            name="category"
            value={newRecipe.category}
            onValueChange={(value) =>
              setNewRecipe({ ...newRecipe, category: value })
            }
          >
            <SelectTrigger className="mb-4">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mb-4">
            <h3 className="mb-2">Ingredients:</h3>
            <div className="flex flex-wrap gap-2">
              {ingredientsList.map((ingredient) => (
                <Badge
                  key={ingredient}
                  variant={
                    newRecipe.ingredients.includes(ingredient)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => handleIngredientSelect(ingredient)}
                >
                  {ingredient}
                </Badge>
              ))}
            </div>
          </div>
          <Textarea
            name="steps"
            value={newRecipe.steps}
            onChange={handleInputChange}
            placeholder="Recipe Steps"
            className="mb-4"
          />
          <Input
            name="cookingTime"
            value={newRecipe.cookingTime}
            onChange={handleInputChange}
            placeholder="Cooking Time (in minutes)"
            type="number"
            className="mb-4"
          />
          <Button onClick={handleSubmitRecipe}>Submit Recipe</Button>
        </CardContent>
      </Card>

      {/* Recipe Search and Filtering */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search Recipes</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search recipes..."
            className="mb-4"
          />
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={
                  selectedFilters.includes(category) ? "default" : "outline"
                }
                className="cursor-pointer"
                onClick={() => handleFilterToggle(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recipe List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecipes.map((recipe) => (
          <Card key={recipe.id}>
            <CardHeader>
              <CardTitle>{recipe.name}</CardTitle>
              <CardDescription>{recipe.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2">
                <strong>Ingredients:</strong> {recipe.ingredients.join(", ")}
              </p>
              <p className="mb-2">
                <strong>Steps:</strong> {recipe.steps}
              </p>
              <p className="mb-4">
                <strong>Cooking Time:</strong> {recipe.cookingTime} minutes
              </p>

              {/* Cooking Timer */}
              <div className="mb-4">
                <Button
                  onClick={() => handleStartTimer(recipe.cookingTime)}
                  className="mr-2"
                >
                  Start Timer
                </Button>
                <Button onClick={handleStopTimer} variant="outline">
                  Stop Timer
                </Button>
                <p className="mt-2">
                  Timer: {Math.floor(timer / 60)}:{timer % 60 < 10 ? "0" : ""}
                  {timer % 60}
                </p>
              </div>

              {/* Comments */}
              <div className="mt-4">
                <h4 className="font-bold mb-2">Comments:</h4>
                {comments[recipe.id]?.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex items-start space-x-2 mb-2"
                  >
                    <Avatar />
                    <p>{comment.text}</p>
                  </div>
                ))}
                <Input
                  placeholder="Add a comment..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddComment(recipe.id, e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecipePlatform;
