const Koa = require('koa');
const Router = require('koa-router');
const Genre = require('./models/genre');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

app.use(bodyParser());

router.get('/api/genres', async (context) => {
  let genres = await Genre.fetchAll();
  context.body = genres;
});

router.get('/api/genres/:id', async (context) => {
  let id = context.params.id;

  try {
    let genre = await new Genre({ GenreId: id }).fetch();

    if (!genre) {
      throw new Error(`Genre ${id} not found`);
    }

    context.body = genre;
  } catch (error) {
    context.status = 404;
    context.body = {
      error: error.message
    };
  }
});

router.post('/api/genres', async (context) => {
  let name = context.request.body.name;

  try {
    if (!name) {
      throw new Error('A genre name cannot be empty');
    }

    let genre = new Genre({ Name: name });
    genreWasFound = await genre.fetch();

    if (genreWasFound) {
      throw new Error(`A genre with the name "${name}" was already created`);
    }

    await genre.save();
    context.body = genre;
  } catch (error) {
    context.status = 422;
    context.body = {
      error: error.message
    };
  }
});

app.use(router.routes());

app.listen(process.env.PORT || 3000);
