// const express = require("express");
// const app = express();
// const mysql = require("mysql2");
// const cors = require("cors");

// // app.use(
// //   express.urlencoded({
// //     extended: true,
// //   })
// // );

//  app.use(cors());
// // app.use(express.json());
// // User account info
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "myDBuser",
//   password: "mydbuser",
//   database: "myDB",
// });
// // Connect to MySQL
// connection.connect((err) => {
//   if (err) console.log(err);
//   else console.log("Connected to MySQL");
// });
// // app.get("/", (req, res) => {
// //   let my_queries =
// //     "SELECT * FROM Products;",
// //     "SELECT * FROM product_description;",
// //     "SELECT * FROM product_price;",
// //   ];

// //   my_queries.forEach((query) => {
// //     connection.query(query, (err, rows, fields) => {
// //       if (err) console.log(err);

// //       res.json(rows);
// //       console.log(rows);
// //     });
// //   });
// // });

// app.get("/products", (req, res) => {

//   connection.query(
//       `SELECT * FROM Products JOIN product_description JOIN  product_price ON Products.product_id=product_description.product_id AND Products.product_id=product_price.product_id `,
//       (err, results, fields) => {
//           if (err) {
//               console.log(`error found: ${err}`);
//               return {
//                   error: true,
//                   message:"tesasitehal lik ayidelem."
//               }
            
//           }
//           res.send(results[0].product_name);
//       }
//   );

// });

// app.listen(3001, () => console.log("listening on:http://localhost:3001"));
