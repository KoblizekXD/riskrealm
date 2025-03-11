import type React from "react";

interface CardProps {
  card: string;
  isHidden?: boolean;
}

const Card: React.FC<CardProps> = ({ card, isHidden = false }) => {
  if (isHidden) {
    return (
      <div className="w-24 h-36 bg-gray-300 border border-gray-400 rounded-lg flex items-center justify-center">

        <img
        src={"/Cards/back.png"}
        alt={"hidden"}
        className="w-full h-full object-cover rounded-lg"
      />
      </div>
    );
  }

  const cardImage = `/Cards/${card}.png`;

  return (
    <div className="w-24 h-36 border border-gray-400 rounded-lg flex items-center justify-center bg-white text-black">
      <img
        src={cardImage}
        alt={card}
        className="w-full h-full object-cover rounded-lg"
      />
    </div>
  );
};

export default Card;
