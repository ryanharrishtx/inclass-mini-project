import express from 'express';
import { getMovies,
         getMovie,
         createMovie,
         getReviews,
         deleteMovie,
         updateReview } from './database.js';

const app = express();
app.use(express.json());

const port = 3000;

app.get('/movies', async (req, res) => {
    const movies = await getMovies()
    res.send(movies)
})

app.get('/movie-reviews', async (req, res) => {
    const reviews = await getReviews()
    res.send(reviews)
})

app.get('/movies/:id', async (req, res) => {
    const id = req.params.id
    const movie = await getMovie(id)
    res.send(movie)
})

app.post('/add-movie', async (req, res) => {
    const { name } = req.body
    const movie = await createMovie(name)
    res.status(201).send(movie)
})

app.put('/movie-reviews/:id', async (req, res) => {
    const id = req.params.id
    const { rating, comment } = req.body
    const review = await updateReview(id, rating, comment)
    res.status(201).send(review)
})

app.delete('/movies/:id', async (req, res) => {
    const id = req.params.id
    await deleteMovie(id)
    res.status(201).send()
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })