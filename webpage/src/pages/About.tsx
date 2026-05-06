import { useState } from "react";

export default function About() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Contador</h1>
      <button onClick={() => setCount(count + 1)}>
        Click: {count}
      </button>
    </div>
  );
}