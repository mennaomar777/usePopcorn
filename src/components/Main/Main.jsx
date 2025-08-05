import React, { useState } from "react";
import MovieDetails from "../MovieDetails/MovieDetails";
import useMovies from "../CustomHooks/useMovies";
import useLocalStorageState from "../CustomHooks/useLocalStorageState";

export default function Main({ movies, query }) {
  const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

  const [watched, setWatched] = useLocalStorageState([], "watched");

  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const { isLoading, error } = useMovies(query);
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.Runtime));

  async function handleSelectedMovie(id) {
    setSelectedId((selectedId) => (selectedId == id ? null : id));
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  if (error) {
    return (
      <p className="error">
        <span>⛔</span> {error}
      </p>
    );
  }

  if (!isLoading && query !== "" && movies?.length === 0) {
    return (
      <p className="error">
        <span>🔍</span> No results found for "<strong>{query}</strong>"
      </p>
    );
  }

  return (
    <>
      {isLoading ? (
        <p className="loader">Loading...</p>
      ) : (
        <main className="main">
          <div className="box">
            <button
              className="btn-toggle"
              onClick={() => setIsOpen1((open) => !open)}
            >
              {isOpen1 ? "-" : "+"}
            </button>
            {isOpen1 && (
              <ul className="list list-movies">
                {movies?.map((movie) => (
                  <li
                    key={movie.imdbID}
                    onClick={() => handleSelectedMovie(movie.imdbID)}
                  >
                    <img src={movie.Poster} alt={`${movie.Title} poster`} />
                    <h3>{movie.Title}</h3>
                    <div>
                      <p>
                        <span>📅</span>
                        <span>{movie.Year}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="box">
            <button
              className="btn-toggle"
              onClick={() => setIsOpen2((open) => !open)}
            >
              {isOpen2 ? "-" : "+"}
            </button>
            {isOpen2 && (
              <>
                {selectedId ? (
                  <MovieDetails
                    selectedId={selectedId}
                    handleCloseMovie={handleCloseMovie}
                    handleAddWatched={handleAddWatched}
                    watched={watched}
                  />
                ) : (
                  <>
                    <div className="summary">
                      <h2>Movies you watched</h2>
                      <div>
                        <p>
                          <span>#️⃣</span>
                          <span>{watched.length} movies</span>
                        </p>
                        <p>
                          <span>⭐️</span>
                          <span>{avgImdbRating.toFixed(2)}</span>
                        </p>
                        <p>
                          <span>🌟</span>
                          <span>{avgUserRating.toFixed(2)}</span>
                        </p>
                        <p>
                          <span>⏳</span>
                          <span>{avgRuntime} min</span>
                        </p>
                      </div>
                    </div>

                    <ul className="list">
                      {watched.map((movie) => (
                        <li key={movie.imdbID}>
                          <img
                            src={movie.Poster}
                            alt={`${movie.Title} poster`}
                          />
                          <h3>{movie.Title}</h3>
                          <div>
                            <p>
                              <span>⭐️</span>
                              <span>{movie.imdbRating}</span>
                            </p>
                            <p>
                              <span>🌟</span>
                              <span>{movie.userRating}</span>
                            </p>
                            <p>
                              <span>⏳</span>
                              <span>{movie.Runtime} min</span>
                            </p>
                            <button
                              className="btn-delete"
                              onClick={() => handleDeleteWatched(movie.imdbID)}
                            >
                              x
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}
          </div>
        </main>
      )}
    </>
  );
}
