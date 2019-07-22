# Mongoose Recipes

## Seeding
mongoimport the two json files in the `data` directory with the `jsonArray` flag set. Initial Cooks and recipes are linked one to one.

```bash
cd path-to-project/data
mongoimport --db recipeApp --collection recipes --file recipes.json --jsonArray
mongoimport --db recipeApp --collection cooks --file cooks.json --jsonArray
```