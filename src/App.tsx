import Card from "./Card";
import "./index.css";

import logo from "./logo.svg";
import reactLogo from "./react.svg";

export default function App() {
  return (
    <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
      <Card name={"The Bungle Bungles"} text="Western Australia" />
      <div className="flex justify-center items-center gap-8 mb-8">
        <img
          src={logo}
          alt="Bun Logo"
          className="h-24 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#646cffaa] scale-120"
        />
        <img
          src={reactLogo}
          alt="React Logo"
          className="h-24 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#61dafbaa] animate-[spin_20s_linear_infinite]"
        />
      </div>

      <h1 className="text-5xl font-bold my-4 leading-tight">
        Bun + React + Cards
      </h1>
    </div>
  );
}
