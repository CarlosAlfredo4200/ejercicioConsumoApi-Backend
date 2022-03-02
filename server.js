const express = require("express");
const mysql = require("mysql");
const cors = require('cors')

const bodyParser = require("body-parser");

const PORT = process.env.PORT || 9000;

const app = express();

app.use(bodyParser.json());
app.use(cors());

//Mysql

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "juanma08",
  database: "library",
});

//Rotes----------- endpoints. Los endpoints son las URLs de un API o un backend que responden a una petición
app.get("/", (req, respuesta) => {
  respuesta.send("Mi api funciona!");
});

// listar libros
app.get("/listar", (req, respuesta) => {
  const sql = "SELECT * FROM books";

  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      respuesta.json(results);
    } else {
      respuesta.send("No se encontraron registros");
    }
  });
});

app.get("/buscar/:id", (req, respuesta) => {
  const { id } = req.params;
  const sql = `SELECT * FROM books WHERE id = ${id}`;
  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      respuesta.json(results);
    } else {
      respuesta.send("No se encontraron registros");
    }
  });
});


app.post("/add", (req, respuesta) => {
 
  const sql = 'INSERT INTO books SET ?';

  const nuevoLibro = {
    titulo: req.body.titulo,
    autor: req.body.autor,
    edicion: req.body.edicion
  };
  connection.query(sql, nuevoLibro, error => {
    if(error) throw error;
    respuesta.send("Se agrego correctamente el libro");
  })
});



app.put("/update/:id", (req, respuesta) => {
  const { id } = req.params;
  const {titulo, autor, edicion} = req.body;

  const sql = `UPDATE books SET titulo = '${titulo}', autor = '${autor}', edicion = '${edicion}' WHERE id = ${id}`;
  connection.query(sql, error => {
    if(error) throw error;
    respuesta.send("Se actualizo correctamente el libro");
  })
  
});



app.delete("/delete/:id", (req, respuesta) => {
  const { id } = req.params;

  const sql = `DELETE FROM books WHERE id = ${id}`;
  connection.query(sql, error => {
    if(error) throw error;
    respuesta.send("Se elimino correctamente el libro");
  })

});

//Check connection---------------------------------------------------------------

connection.connect((error) => {
  if (error) throw error;
  console.log("Database server running!");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
