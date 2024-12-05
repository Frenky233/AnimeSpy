import { useState } from "react";

export type voteType = "Player" | "Card" | null;

type Hook = () => {
  showCancel: boolean;
  voteType: voteType;
  onStartVoting: (type: voteType) => void;
  onCancelVoting: () => void;
};

export const useControls: Hook = () => {
  const [isVoting, setIsVoting] = useState<{
    showCancel: boolean;
    voteType: voteType;
  }>({ showCancel: false, voteType: null });

  const onStartVoting = (voteType: voteType) => {
    setIsVoting({ showCancel: true, voteType });
  };

  const onCancelVoting = () => {
    setIsVoting({ showCancel: false, voteType: null });
  };

  return {
    ...isVoting,
    onStartVoting,
    onCancelVoting,
  };
};
