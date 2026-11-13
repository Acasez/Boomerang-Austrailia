interface CardProps {
  name: string;
  text: string;
}

export default function Card({ name, text }: CardProps) {
  return (
    <div className="w-100 h-100 rounded-2xl bg-amber-100 text-gray-800">
      <h1 className="text-3xl align-middle font-bold">{name}</h1>
      <p>{text}</p>
    </div>
  );
}
