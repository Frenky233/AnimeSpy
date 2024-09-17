import axios from "axios";
import { useRef, useState } from "react";

type imageResponse = {
  data: string;
  success: boolean;
  status: number;
};

type Hook = (
  onClose: () => void,
  initialImg?: string
) => {
  onStartUpload: () => void;
  onChange: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onSubmit: () => Promise<void>;
  currentAvatar: string | undefined;
  fileInputRef: React.RefObject<HTMLInputElement>;
  errorMessageRef: React.RefObject<HTMLDivElement>;
};

export const useAvatarUpdate: Hook = (onClose, initialImg) => {
  const [currentAvatar, setCurrentAvatar] = useState<string | undefined>(
    initialImg
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const errorMessageRef = useRef<HTMLDivElement>(null);

  const onStartUpload = () => {
    fileInputRef.current?.click();
  };

  const handleError = () => {
    errorMessageRef.current!.style.opacity = "1";
    setTimeout(function () {
      errorMessageRef.current!.removeAttribute("style");
    }, 4000);
  };

  const onChange = () => {
    const avatar = fileInputRef.current!.files![0];
    if (avatar.size > 1048576) {
      handleError();
      fileInputRef.current!.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = function () {
      setCurrentAvatar(reader.result as string);
    };
    reader.readAsDataURL(avatar);
  };

  const onDelete = () => {
    setCurrentAvatar(undefined);
  };

  const onCancel = () => {
    setCurrentAvatar(initialImg);
  };

  const onSubmit = async () => {
    if (initialImg === currentAvatar) onClose();

    const formData = new FormData();
    formData.append("image", fileInputRef.current!.files![0]);
    formData.append("type", "image");

    try {
      const response: imageResponse = await axios.post(
        "https://api.imgur.com/3/image",
        formData,
        {
          headers: {
            Authorization: `Client-ID ${import.meta.env.IMGUR_CLIENT_ID}`,
          },
        }
      );

      console.log(response);

      if (!response.success) {
        console.log(response);
        return;
      }

      localStorage.setItem("imageURL", response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return {
    currentAvatar,
    fileInputRef,
    errorMessageRef,
    onStartUpload,
    onChange,
    onDelete,
    onCancel,
    onSubmit,
  };
};
