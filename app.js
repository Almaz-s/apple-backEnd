const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json()); // Middleware to parse JSON data from the frontend

// Database connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  queueLimit: 0,
});

connection.connect((err) => {
  if (err) console.log("Connection error:", err);
  else console.log("Connected to MySQL");
});

app.get("/", (req, res) => res.send("Server is running"));

// !Question 2 - Table Creation
app.get("/install", (req, res) => {
  const message = "Tables created successfully";

  const products = `CREATE TABLE if not exists products (
    product_id int auto_increment,
    product_url varchar(255) not null,
    product_name varchar(255) not null,
    PRIMARY KEY (product_id)
  )`;

  const product_description = `CREATE TABLE if not exists product_description (
    description_id int auto_increment,
    product_id int not null,
    product_brief_description TEXT not null,
    product_description TEXT not null,
    product_img varchar(255) not null,
    product_link varchar(255) not null,
    PRIMARY KEY (description_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
  )`;

  const product_price = `CREATE TABLE if not exists product_price (
    price_id int auto_increment,
    product_id int not null,
    starting_price varchar(255) not null,
    price_range varchar(255) not null,
    PRIMARY KEY (price_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
  )`;

  const user = `CREATE TABLE if not exists users (
    user_id int auto_increment,
    user_name varchar(255) not null,
    user_password varchar(255) not null,
    PRIMARY KEY (user_id)
  )`;

  const orders = `CREATE TABLE if not exists orders (
    order_id int auto_increment,
    product_id int not null,
    user_id int not null,
    PRIMARY KEY (order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
  )`;

  // Executing the table creation queries
  connection.query(products, (err) => {
    if (err) console.log(err);
    else console.log("Products table created.");
  });

  connection.query(product_description, (err) => {
    if (err) console.log(err);
    else console.log("Product description table created.");
  });

  connection.query(product_price, (err) => {
    if (err) console.log(err);
    else console.log("Product price table created.");
  });

  connection.query(user, (err) => {
    if (err) console.log(err);
    else console.log("Users table created.");
  });

  connection.query(orders, (err) => {
    if (err) console.log(err);
    else console.log("Orders table created.");
  });

  res.send(message);
});

// Add product to database
app.post("/add_product", (req, res) => {
  const {
    product_name,
    products_url,
    product_description,
    product_brief_description,
    product_img,
    product_link,
    starting_price,
    price_range,
    user_name,
    user_password,
  } = req.body;

  // Insert queries
  let insertProducts = `INSERT INTO products (product_url, product_name) VALUES (?, ?)`;
  let insertProduct_description = `INSERT INTO product_description (product_id, product_brief_description, product_description, 
    product_img, product_link) VALUES (?, ?, ?, ?, ?)`;
  let insertProduct_price = `INSERT INTO product_price (product_id, starting_price, price_range) VALUES (?, ?, ?)`;
  let insertUsers = `INSERT INTO users (user_name, user_password) VALUES (?, ?)`;
  let insertOrders = `INSERT INTO orders (product_id, user_id) VALUES (?, ?)`;

  connection.query(
    insertProducts,
    [products_url, product_name],
    (err, results) => {
      if (err) console.log(err);
      else {
        const pro_id = results.insertId;

        connection.query(
          insertProduct_description,
          [
            pro_id,
            product_brief_description,
            product_description,
            product_img,
            product_link,
          ],
          (err) => {
            if (err) console.log(err);
          }
        );

        connection.query(
          insertProduct_price,
          [pro_id, starting_price, price_range],
          (err) => {
            if (err) console.log(err);
          }
        );

        connection.query(
          insertUsers,
          [user_name, user_password],
          (err, results) => {
            if (err) console.log(err);
            else {
              const us_id = results.insertId;

              connection.query(insertOrders, [pro_id, us_id], (err) => {
                if (err) console.log(err);
              });
            }
          }
        );
      }
    }
  );

  res.send("Data inserted successfully!");
});

// Fetch all products
app.get("/products", (req, res) => {
  connection.query(
    `SELECT * FROM products 
     JOIN product_description ON products.product_id = product_description.product_id 
     JOIN product_price ON products.product_id = product_price.product_id`,
    (err, rows) => {
      if (err) return res.status(500).send("Error fetching products");
      res.json({ products: rows });
    }
  );
});

// Fetch single product by ID
app.get("/products/:productID", (req, res) => {
  const { productID } = req.params;

  connection.query(
    `SELECT 
        products.product_id, 
        products.product_url, 
        products.product_name, 
        product_description.product_brief_description, 
        product_description.product_description, 
        product_description.product_img, 
        product_description.product_link, 
        product_price.starting_price, 
        product_price.price_range 
      FROM 
        products 
        JOIN product_description ON products.product_id = product_description.product_id 
        JOIN product_price ON products.product_id = product_price.product_id
      WHERE 
        products.product_id = ?`,
    [productID],
    (err, results) => {
      if (err) {
        console.log("Error During selection", err);
        res.status(500).send("An error occurred");
      } else if (results.length === 0) {
        res.status(404).send("Product not found");
      } else {
        res.json({ product: results[0] });
      }
    }
  );
});

app.listen(3001, () =>
  console.log("Server listening on http://localhost:3001")
);
