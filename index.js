const mongoose = require('mongoose');
const Recipe = require('./models/Recipe'); // Import of the model Recipe from './models/Recipe'

// do each operation after the other since some (e.g. delete and update) depend on previous opperations
async function crud() {
  // add one recipe
  await Recipe.create({
      title: 'Feet',
      level: 'Amateur Chef',
      ingredients: ['2 Feet', '5kg cheese', '3 cups soy sauce', 'something to pinch your nose', 'good appetite...'],
      cuisine: 'Unique',
      dishType: 'Dish',
      image: 'https://i.ytimg.com/vi/yUutwtaU1Rk/maxresdefault.jpg',
      duration: 20,
      creator: 'Some weird guy'
    })
    .then(recipe => console.log("Added recipe '" + recipe.title + "'"))
    .catch(error => console.log("Error while adding recipe: " + error))

  // insert many
  await Recipe.insertMany(require("./data"))
    .then(() => {
      console.log("Success in bulk inserting")
    })
    .catch(error => console.log("Error while bulk inserting: " + error));

  // update one
  await Recipe.updateOne({
      title: "Rigatoni alla Genovese"
    }, {
      duration: 100
    })
    .then(doc => console.log(doc.n === 1 && doc.ok === 1 ? "Success updating 'Rigatoni alla Genovese'" : "Failed updating 'Rigatoni alla Genovese'"))
    .catch(error => console.log("Error while adding recipe: " + error))

  // delete one
  await Recipe.deleteOne({
      title: "Carrot Cake"
    })
    .then(doc => console.log(doc.deletedCount === 1 ? "Successfully deleted 'Carrot Cake'" : "'Carrot Cake' not found" ))
    .catch(error => console.log("Error while deleting 'Carrot Cake': " + error))

  console.log("Disconnecting data base...")
  mongoose.disconnect()
}

// Connection to the database "recipeApp"
mongoose.connect('mongodb://localhost/recipeApp', {
    useNewUrlParser: true
  })
  .then(() => {
    console.log('Connected to Mongo!');
    crud();
  }).catch(err => {
    console.error('Error connecting to mongo', err);
  });