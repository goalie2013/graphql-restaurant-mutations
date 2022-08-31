const { graphqlHTTP } = require("express-graphql");
const { buildSchema, assertInputType } = require("graphql");
const express = require("express");

// Construct a schema, using GraphQL schema language
let restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];
const schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input restaurantInput{
  name: String
  description: String
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!): restaurant
}
`);
// The root provides a resolver function for each API endpoint

const root = {
  restaurant: (arg) => {
    // Your code goes here
    return restaurants[arg.id - 1];
  },

  restaurants: () => {
    // Your code goes here
    return restaurants;
  },

  setrestaurant: ({ input }) => {
    // Your code goes here
    const newRestaurant = {
      name: input.name,
      description: input.description,
    };
    restaurants = [...restaurants, newRestaurant];
    return newRestaurant;
  },

  deleterestaurant: ({ id }) => {
    let ok;
    if (restaurants[id - 1]) {
      ok = true;

      restaurants = restaurants.filter((r) => r.id !== id);

      return { ok };
    }
    ok = false;
    return { ok };
  },

  editrestaurant: ({ id, ...restaurant }) => {
    if (restaurants[id - 1]) {
      restaurants[id - 1] = {
        ...restaurants[id - 1],
        ...restaurant,
      };
      return restaurants[id - 1];
    }
    return false;
  },
};

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

const port = 5500;
app.listen(port, () => console.log("Running Graphql on Port:" + port));

// export default root;
