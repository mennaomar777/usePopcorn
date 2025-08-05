import React, { useState, useEffect } from "react";
const key = "37934fad";

export default function useMovies(query) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchMovies() {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${key}&s=${query}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        if (data.Response === "False") {
          setMovies([]);
          return;
        }
        setMovies(data.Search);
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error);
          // console.log(error);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchMovies();

    return () => {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, error };
}
