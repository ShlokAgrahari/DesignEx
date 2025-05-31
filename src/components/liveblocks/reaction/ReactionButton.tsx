import React from "react";
type Props = {
  setReaction: (reaction: string, x: number, y: number) => void;
};

const ReactionSelector = ({ setReaction }: Props) => (
  <div
    className='absolute bottom-20 left-0 right-0 mx-auto w-fit transform rounded-full bg-white px-2'
    onPointerMove={(e) => e.stopPropagation()}
  >
    <ReactionButton reaction='👍' onSelect={setReaction} />
    <ReactionButton reaction='🔥' onSelect={setReaction} />
    <ReactionButton reaction='😍' onSelect={setReaction} />
    <ReactionButton reaction='👀' onSelect={setReaction} />
    <ReactionButton reaction='😱' onSelect={setReaction} />
    <ReactionButton reaction='🙁' onSelect={setReaction} />
  </div>
);


type ReactionButtonProps = {
  reaction: string;
  onSelect: (reaction: string, x: number, y: number) => void;
};

const ReactionButton = ({ reaction, onSelect }: ReactionButtonProps) => (
  <button
    className='transform select-none p-2 text-xl transition-transform hover:scale-150 focus:scale-150 focus:outline-none'
    onClick={(e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      onSelect(reaction, x, y); // now passes x, y
    }}
  >
    {reaction}
  </button>
);


export default ReactionSelector;