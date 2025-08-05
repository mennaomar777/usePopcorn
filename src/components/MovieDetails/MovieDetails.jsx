import React, { useEffect, useRef, useState } from "react";
import StarRating from "../StarRating/StarRating";
import useKey from "../CustomHooks/useKey";

export default function MovieDetails({
  selectedId,
  handleCloseMovie,
  handleAddWatched,
  watched,
}) {
  const countRef = useRef(0);
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const key = "37934fad";
  const { Title, Year, Poster, imdbRating, Runtime } = movie;
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  useKey("Escape", handleCloseMovie);

  useEffect(() => {
    if (userRating) countRef.current = countRef.current + 1;
  }, [userRating]);

  async function getMovieDetails() {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${key}&i=${selectedId}`
      );
      const data = await res.json();
      setMovie(data);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      Title,
      Year,
      Poster,
      imdbRating: Number(imdbRating),
      Runtime: Number(Runtime.split(" ").at(0)),
      userRating,
      CountRatingDecisions: countRef.current,
    };
    handleAddWatched(newWatchedMovie);
    handleCloseMovie();
  }

  useEffect(() => {
    getMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    if (!Title) return;
    document.title = `Movie: ${Title}`;
    return () => {
      document.title = `usePopcorn`;
    };
  }, [Title]);

  return (
    <div className="details">
      {isLoading ? (
        <p className="loader">Loading...</p>
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={handleCloseMovie}>
              &larr;
            </button>
            <img src={movie.Poster} alt={`Poster of ${movie.Title} movie`} />
            <div className="details-overview">
              <h2>{movie.Title}</h2>
              <p>
                {movie.Released} &bull; {movie.Runtime}
              </p>
              <p>{movie.Genre}</p>
              <p>
                <span>⭐️</span>
                {movie.imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated this movie {watchedUserRating} <span>⭐️</span>
                </p>
              )}
            </div>
            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>Starring {movie.Actors}</p>
            <p>Directed by {movie.Director}</p>
          </section>
        </>
      )}
    </div>
  );
}
