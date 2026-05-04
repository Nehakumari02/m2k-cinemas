const fetch = require('node-fetch');

async function test() {
  const res = await fetch('http://localhost:5000/movies');
  const movies = await res.json();
  console.log('Movies count:', movies.length);
  if (movies.length > 0) {
    console.log('First movie title:', movies[0].title);
    console.log('First movie isPublished:', movies[0].isPublished);
  }
}

test();
