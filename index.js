import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

const db = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "permalistProject",
  password: "123456",  //pgadmin password
  port: 5432
});



 async function getItems() {
  const items = await db.query("SELECT * FROM items ORDER BY id ASC");
  return items.rows;
}

app.get("/", async(req, res) => {
  const items = await getItems();
  console.log(items);
  res.render("index", {
    listTitle: "Bugün",
    listItems: items,
  });
});

app.post("/add", async(req, res) => {
try {
    const item = req.body.newItem;
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
    res.redirect("/");
} catch (error) {
  console.log(error);
}
});

app.post("/edit", async(req, res) => {
try {
    const itemid = req.body.updatedItemId;
    const itemtitle = req.body.updatedItemTitle;
    await db.query("UPDATE items SET title = $1 WHERE id = $2", [itemtitle, itemid]);
    res.redirect("/");
} catch (error) {
  console.log(error);
}
});

app.post("/delete", async(req, res) => {
try {
    const item = req.body.deleteItemId;
    const query = await db.query("DELETE FROM items WHERE id = $1", [item]);
    res.redirect("/");
} catch (error) {
  console.log(error);
}
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
