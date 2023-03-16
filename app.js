const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

const port = process.env.PORT || 3000;

app.set('views', "./views");
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

mongoose.set('strictQuery', false);

mongoose
  .connect(
    `mongodb://127.0.0.1:27017/wikiDB`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

  const Schema = mongoose.Schema;

  const articleSchema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true}
  });

  const Article = mongoose.model('Article', articleSchema);


  //Mongoose v6.0, the Model.find() method no longer accepts a callback function as the last argument.
  // app.get('/articles', (req, res) => {
  //   Article.find({}, function(err, foundArticles) {
  //     if(!err) {
  //       console.log(foundArticles);
  //       res.send(foundArticles);
  //     } else {
  //       res.send(err);
  //     }
  //   })
  // });


  //We should use a promise or an async/await syntax to handle the returned result.
  app.get('/articles', async (req, res) => {
    try {
      const foundArticles = await Article.find();
      console.log(foundArticles);
      res.send(foundArticles);
    } catch(err) {
      console.log(err);
      res.send(err);
    }
  });

app.listen(port, function() {
  console.log(`App listening at http://localhost:${port}`);
})