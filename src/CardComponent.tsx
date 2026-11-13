import type { Card } from "./Types/Card";
interface CardProps {
  card: Card;
}

export default function CardComponent({ card }: CardProps) {
  return (
    <div className="w-100 h-100 rounded-2xl bg-amber-200 text-white flex flex-col justify-between">
      <div className="border-2 border-red-700 rounded-4xl bg-white text-red-700 text-2xl w-10 text-center">
        <p>{card.throwValue}</p>
      </div>
      <div className="flex flex-row">
        <div className="border-2 border-white rounded-4xl text-2xl w-10 h-10 text-center">
          <p>{card.site}</p>
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl align-middle font-bold">{card.name}</h1>
          <p>{card.region}</p>
        </div>
      </div>
    </div>
  );
}
