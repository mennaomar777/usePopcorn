import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Main from "./components/Main/Main";
import useMovies from "./components/CustomHooks/useMovies";

export default function App() {
  const [query, setQuery] = useState("");
  const { movies } = useMovies(query);
  return (
    <div>
      <Navbar movies={movies} query={query} setQuery={setQuery} />
      <Main movies={movies} query={query} />
    </div>
  );
}
