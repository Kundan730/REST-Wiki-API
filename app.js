const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

const port = process.env.PORT || 3000;

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

mongoose.set('strictQuery', false);

mongoose
  .connect(`mongodb://127.0.0.1:27017/wikiDB`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
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

//Targeting all articles
app
  .route('/articles')
  .get(async (req, res) => {
    try {
      const foundArticles = await Article.find();
      console.log(foundArticles);
      res.send(foundArticles);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  })
  .post((req, res) => {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle
      .save()
      .then(() => {
        console.log('Model saved successfully');
        res.send('Article saved successfully');
      })
      .catch((err) => {
        console.error('Error while saving model', err);
      });
  })
  .delete((req, res) => {
    Article.deleteMany()
      .then(() => {
        console.log('All articles deleted successfully');
        res.send('All articles deleted successfully');
      })
      .catch((err) => {
        console.log('Error while deleting all articles', err);
        res.send('Error while deleting all articles', err);
      });
  });

//We should use a promise or an async/await syntax to handle the returned result.
// app.get('/articles', async (req, res) => {
//   try {
//     const foundArticles = await Article.find();
//     console.log(foundArticles);
//     res.send(foundArticles);
//   } catch(err) {
//     console.log(err);
//     res.send(err);
//   }
// });

// app.post('/articles', (req, res) => {
//   console.log(req.body.title);
//   console.log(req.body.content);

//   const newArticle = new Article({
//     title: req.body.title,
//     content: req.body.content
//   });

//   newArticle.save()
//   .then(() => {
//     console.log('Model saved successfully');
//     res.send('Article saved successfully')
//   })
//   .catch((err) => {
//     console.error('Error while saving model', err);
//   });
// });

// app.delete('/articles', (req, res) => {
//   Article.deleteMany()
//   .then( () => {
//     console.log('All articles deleted successfully');
//     res.send('All articles deleted successfully');
//   })
//   .catch( (err) => {
//     console.log('Error while deleting all articles', err)
//     res.send('Error while deleting all articles', err);
//   });
// });

//Targeting specific articles
app.route('/articles/:articleTitle').get( async (req, res) => {
  try{
    const foundArticle = await Article.findOne({title: req.params.articleTitle});
    console.log(foundArticle);
    res.send(foundArticle);
  } catch(err) {
    console.log(err);
    res.send(err);
  }
})

.put( async (req, res) => {
  try {
    const updateArticles = await Article.findOneAndUpdate({title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content}, {overwrite: true});

    if(updateArticles) {
      console.log(updateArticles);
      res.send('Article updated successfully');
    } else {
      res.send('Article not found');
      res.status(404).send('Article not found');
    }
  } catch(err) {
    console.log(err);
    res.send(err);
    res.status(500).send('Error updating article');
  }
});

app.listen(port, function () {
  console.log(`App listening at http://localhost:${port}`);
});

// {
//   "_id": {
//     "$oid": "6411c6e918de7d276ab0a948"
//   },
//   "title": "REST",
//   "content": "REST stand for Representational state transfer, Its a architectural style for designing APIs.",
//   "name": "Kundan"
// }
