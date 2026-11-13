import type { Card } from "./Types/Card";
interface CardProps {
  card: Card;
}

export default function CardComponent({ card }: CardProps) {
  return (
    <div className="w-75 h-100 rounded-2xl bg-amber-200 text-white flex flex-row">
      <div className="flex flex-col flex-1 justify-between m-4">
        <div className="border-2 border-red-700 rounded-4xl bg-white text-red-700 text-2xl w-10 text-center">
          <p>{card.throwValue}</p>
        </div>
        <div className="border-3 border-white rounded-4xl text-3xl w-10 h-10 text-center justify-center mb-5">
          <p>{card.site}</p>
        </div>
      </div>
      <div className="flex flex-col flex-10 justify-end m-2 mb-5">
        <div className="bg-amber-300 rounded-2xl mr-4">
          <h1 className="text-4xl align-middle font-bold">{card.name}</h1>
          <p>{card.region}</p>
        </div>
      </div>
    </div>
  );
}
