# Recipe Calculator

Frontend is build with React.

Backend is built with Flask

Postgresql is used as the database

The table structures look like:

<img width="1112" alt="image" src="https://user-images.githubusercontent.com/54939056/230743347-8e96b5fd-05bb-4c76-bc06-ded244df5474.png">

The Recipes table stores information about each recipe, including its name, description, and total cost. The Ingredients table stores information about each ingredient, including its name, purchase price, and quantity. The Recipe_Ingredients table is a junction table that stores the relationship between recipes and ingredients, including the weight of each ingredient used in the recipe.

With this structure, we can easily calculate the total cost of a recipe by multiplying the weight of each ingredient by its purchase price and summing the results. This structure also ensures that we can easily add, delete, or modify recipes and ingredients without impacting the integrity of the data.

It's possible to include the cost columns in the Ingredients table. However, if we add the purchase_price and quantity columns to the Ingredients table, it would violate the principles of database normalization.

The application is deployed and run on an ec2 instance. It is made accessible via the internet.

Expected Behavior:
The weight, purchase amount and purchase price columns will either not allowing alphabets(except e as e is used to represent exponential numbers) to be entered or net let the users submit the recipe. Incase, users are able to enter alphabets in one of these columns, the Done button does not show up on the Ingredients side and the calculate button does not get enabled on the Cost side

The page does not let users save the recipe without the users giving it a name

The page does not let users enter the same ingredient name twice

The total cost will be updated dynamically for the following use cases:
1. When an ingredient is deleted.
2. When the purchase price or purchase amount for an ingredient is changed.

The flask application takes care of creating the tables if postgres is properly configured with the username, password and database name

It can be accessed here: http://52.90.194.169:3000

Assuming that there is postgres, flask and npm installed, the application can be run by the following commands:
1. `cd sous-recipe-calculator/frontend-sous`
2. `npm run start-both` or `yarn start-both`
