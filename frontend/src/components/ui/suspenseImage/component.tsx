import { FC, useState } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";

type Props = {
  src: string;
  srcSet?: string;
  alt?: string;
  className?: string;
};

export const SuspenseImage: FC<Props> = ({
  src,
  srcSet,
  className,
  alt = "",
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const onImageLoaded = () => setIsLoading(false);

  return (
    <div className={clsx(styles.image, isLoading && styles.loading, className)}>
      <img src={src} alt={alt} srcSet={srcSet} onLoad={onImageLoaded}></img>
    </div>
  );
};
