import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getMovies() {
    const [rows] = await pool.query(`
        SELECT movies.*, GROUP_CONCAT(reviews.comment ORDER BY reviews.id) AS reviews
        FROM movies
        LEFT JOIN reviews ON movies.id = reviews.movie_id
        GROUP BY movies.id
    `);

    return rows;
}


export async function getReviews() {
    const [rows] = await pool.query('SELECT * FROM reviews')
    return rows
}

export async function getMovie(id) {
const [rows] = await pool.query(`
SELECT *
FROM movies
WHERE id = ?`, [id])
return rows
}

export async function getReview(id) {
    const [rows] = await pool.query(`
    SELECT *
    FROM reviews
    WHERE id = ?`, [id])
    return rows
    }

export async function createMovie(name) {
    const [result] = await pool.query(`
    INSERT INTO movies (name)
    VALUES (?)`, [name])
    const id = result.insertId
    return getMovie(id)
}

export async function updateReview(movie_id, rating, comment) {
    const [result] = await pool.query(`
    UPDATE reviews
    SET rating = ?, comment = ?
    WHERE movie_id = ?
    `, [rating, comment, movie_id])
    const id = result.insertId
    return getReview(id)
}

export async function deleteMovie(movie_id) {
    // Delete reviews associated with the movie
    await pool.query('DELETE FROM reviews WHERE movie_id = ?', [movie_id]);

    // Then delete the movie
    await pool.query('DELETE FROM movies WHERE id = ?', [movie_id]);
}
