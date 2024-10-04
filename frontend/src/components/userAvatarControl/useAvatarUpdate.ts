import { UserSetterContext } from "@/contexts/user";
import axios, { AxiosHeaders } from "axios";
import { useContext, useRef, useState } from "react";

type imageResponse = {
  data: { id: string; deletehash: string };
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
  submitButtonRef: React.RefObject<HTMLButtonElement>;
  showPopup: boolean;
  terminate: () => void;
};

export const useAvatarUpdate: Hook = (onClose, initialImg) => {
  const [currentAvatar, setCurrentAvatar] = useState<string | undefined>(
    initialImg
  );
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const { setUserAvatar } = useContext(UserSetterContext)!;

  const onStartUpload = () => {
    fileInputRef.current?.click();
  };

  const onChange = () => {
    const avatar = fileInputRef.current!.files![0];
    if (avatar.size > 1048576) {
      setShowPopup(true);
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

    submitButtonRef.current!.dataset.loading = "true";
    if (!currentAvatar && initialImg)
      await deleteAvatar(
        localStorage.getItem("avatarDeleteHash") as string,
        setUserAvatar
      );
    else if (currentAvatar && !initialImg)
      await uploadAvatar(fileInputRef.current!.files![0], setUserAvatar);
    else if (currentAvatar && initialImg) {
      await Promise.all([
        deleteAvatar(
          localStorage.getItem("avatarDeleteHash") as string,
          setUserAvatar
        ),
        uploadAvatar(fileInputRef.current!.files![0], setUserAvatar),
      ]);
    }
    submitButtonRef.current!.removeAttribute("data-loading");

    onClose();
  };

  return {
    currentAvatar,
    fileInputRef,
    submitButtonRef,
    onStartUpload,
    onChange,
    onDelete,
    onCancel,
    onSubmit,
    showPopup,
    terminate: () => setShowPopup(false),
  };
};

const uploadAvatar = async (image: File, setLocal: (id: string) => void) => {
  const headers = new AxiosHeaders();
  headers.setAuthorization(`Client-ID ${import.meta.env.VITE_IMGUR_CLIENT_ID}`);

  const formData = new FormData();
  formData.append("image", image);
  formData.append("type", "image");

  try {
    const response = await axios.post(
      "https://api.imgur.com/3/image",
      formData,
      {
        headers,
      }
    );

    const result: imageResponse = response.data;

    if (!result.success) {
      console.log(response);
      return;
    }

    localStorage.setItem("avatarID", result.data.id);
    localStorage.setItem("avatarDeleteHash", result.data.deletehash);
    setLocal(result.data.id);
  } catch (err) {
    console.log(err);
  }
};

const deleteAvatar = async (
  deleteHash: string,
  setLocal: (id: string) => void
) => {
  const headers = new AxiosHeaders();
  headers.setAuthorization(`Client-ID ${import.meta.env.VITE_IMGUR_CLIENT_ID}`);

  try {
    const response = await axios.delete(
      `https://api.imgur.com/3/image/${deleteHash}`,
      { headers }
    );

    const result: imageResponse = await response.data;

    if (!result.success) {
      console.log(result);
      return;
    }

    localStorage.removeItem("avatarID");
    localStorage.removeItem("avatarDeleteHash");
    setLocal("");
  } catch (err) {
    console.log(err);
  }
};
