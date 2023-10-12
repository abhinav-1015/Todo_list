const express= require('express');
const bodyParser= require('body-parser');
const pg=require('pg');
const app=express();

const pool=new pg.Pool({
    user:'postgres',
    password:'password',
    database:'postgres',
    host:'localhost',
    port:5432
});


app.get('/todo-items',async(req,res) => {
    const results=await pool.query('SELECT * FROM todo-items');
    res.json(results.rows);
});

app.post('/todo-items', async (req, res) => {
    const { title, description } = req.body;
    const results = await pool.query('INSERT INTO todo_items (title, description) VALUES ($1, $2)', [title, description]);
    res.json(results.rows[0]);
});

app.get('/todo-items/:id', async (req, res) => {
    const id = req.params.id;
    const results = await pool.query('SELECT * FROM todo_items WHERE id = $1', [id]);
    res.json(results.rows[0]);
});

app.put('/todo-items/:id', async (req, res) => {
    const id = req.params.id;
    const { title, description, completed } = req.body;
    const results = await pool.query('UPDATE todo_items SET title = $1, description = $2, completed = $3 WHERE id = $4', [title, description, completed, id]);
    res.json(results.rows[0]);
});

app.delete('/todo-items/:id', async (req, res) => {
    const id = req.params.id;
    const results = await pool.query('DELETE FROM todo_items WHERE id = $1', [id]);
    res.sendStatus(204);
});
  
app.listen(3000, () => {
    console.log('API listening on port 3000');
});


pool.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});