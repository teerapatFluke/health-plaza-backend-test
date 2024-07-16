const express = require("express");
const app = express();
const port = 3000;
var fs = require("fs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let obj = {
  data: [],
};
app.get("/", (req, res) => {
  fs.readFile("todoList.json", "utf8", function readFileCallback(err, data) {
    if (err) {
      res.send(err);
    } else {
      try {
        const fileData = JSON.parse(data);
        res.send(fileData);
      } catch (error) {
        res.send("Error parsing JSON:", error);
        obj = { data: [] };
      }
    }
  });
});
app.post("/", (req, res) => {
  fs.readFile("todoList.json", "utf8", function readFileCallback(err, data) {
    if (err) {
      console.log(err);
      obj = {
        data: [],
      };
    } else {
      try {
        const fileData = JSON.parse(data);
        console.log(fileData);
        obj = fileData;
      } catch (error) {
        console.log("Error parsing JSON:", error);
        obj = { data: [] };
      }
    }
    const todo = {
      id: obj.data.length,
      name: req.body.name,
      detail: req.body.detail,
      finished: false,
    };
    obj.data.push(todo);

    let json = JSON.stringify(obj);

    fs.writeFile("todoList.json", json, "utf8", function (err) {
      if (err) {
        console.error("Error writing file:", err);
        res.send("Error writing file:", err);
      } else {
        console.log("File written successfully");
        res.send(todo);
      }
    });
  });
});

app.put("/:id", (req, res) => {
  fs.readFile("todoList.json", "utf8", function readFileCallback(err, data) {
    if (err) {
      res.send("Not Found");
    } else {
      try {
        const fileData = JSON.parse(data);
        const id = req.params.id;
        console.log(id);
        obj = fileData;
        let editIndex = null;
        for (let i in obj.data) {
          console.log(i);
          console.log(obj.data[i].id);
          if (obj.data[i].id == id) {
            editIndex = i;
            break;
          }
        }
        console.log(editIndex);
        if (editIndex) {
          const todo = {
            id: editIndex,
            name: req.body.name ? req.body.name : obj.data[editIndex].name,
            detail: req.body.detail
              ? req.body.detail
              : obj.data[editIndex].detail,
            finished: req.body.finished
              ? req.body.finished
              : obj.data[editIndex].finished,
          };
          obj.data[editIndex] = todo;
          let json = JSON.stringify(obj);
          fs.writeFile("todoList.json", json, "utf8", function (err) {
            if (err) {
              console.error("Error writing file:", err);
              res.send("Error writing file:", err);
            } else {
              console.log("File written successfully");
              res.send(todo);
            }
          });
        } else {
          res.send("Not Found");
        }
      } catch (error) {
        console.log("Error parsing JSON:", error);
        res.send("Not Found");
      }
    }
  });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
