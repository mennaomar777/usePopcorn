import React, { useEffect } from "react";

export default function useKey(key, action) {
  useEffect(() => {
    function callback(e) {
      if (e.key.toLowerCase() === key.toLowerCase()) {
        return action();
      }
    }
    document.addEventListener("keydown", callback);
    return function () {
      document.removeEventListener("keydown", callback);
    };
  }, [key, action]);
}
