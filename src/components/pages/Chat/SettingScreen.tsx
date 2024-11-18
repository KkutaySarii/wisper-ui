import { useTheme } from "next-themes";
import { useState } from "react";
import Image from "next/image";

import { BackIcon } from "@/assets/svg/BackIcon";
import { EditIcon } from "@/assets/svg/EditIcon";
import { CancelIcon } from "@/assets/svg/CancelIcon";
import { useAppDispatch } from "@/types/state";
import { setImage, setUsername } from "@/redux/slices/chat/slice";
import { ImageType } from "@/types/messages";
import toast from "react-hot-toast";

interface SettingScreenProps {
  setIsSettingsOpen: (value: boolean) => void;
  image: ImageType;
  username: string | null;
  chatWith: string | null;
}

export const SettingScreen = ({
  setIsSettingsOpen,
  image,
  chatWith,
  username,
}: SettingScreenProps) => {
  const { theme } = useTheme();

  const dispatch = useAppDispatch();

  const [isEditName, setIsEditName] = useState<boolean>(false);

  const [newName, setNewName] = useState<string>(username || "");

  const [selectedImage, setSelectedImage] = useState<ImageType>(image);

  if (!chatWith) {
    return null;
  }

  const handleEditName = () => {
    setIsEditName(!isEditName);
  };

  const handleBack = () => {
    setIsSettingsOpen(false);
  };

  const handleSaveUsername = () => {
    dispatch(setUsername({ chatWith, username: newName }));
    setIsEditName(false);
    setIsSettingsOpen(false);
  };

  const handleSaveImage = () => {
    dispatch(setImage({ chatWith, image: selectedImage || "default" }));
    toast.success("Image saved successfully!", {
      position: "top-right",
    });

    setIsSettingsOpen(false);
  };

  const selectImage = (image: ImageType) => {
    setSelectedImage(image);
  };

  return (
    <div className="p-6 flex flex-col">
      <button onClick={handleBack}>
        <BackIcon theme={theme} />
      </button>
      <div className="flex flex-col mobile:flex-row items-center gap-x-4 mt-6 px-4">
        <Image alt="user" src={`/users/${image}.svg`} width={72} height={72} />
        <div className="flex items-start gap-x-2.5">
          <div className={` flex-1 py-1 flex flex-col gap-y-2`}>
            {username && (
              <p className="font-semibold text-light-text-secondary dark:text-white text-base">
                {username}
              </p>
            )}
            <p
              className={` font-semibold  text-light-chats-text dark:text-white text-sm ${
                username ? "text-opacity-60" : ""
              }`}
            >
              {chatWith?.slice(0, 24) + "..." + chatWith?.slice(-12)}
            </p>
            {isEditName && (
              <label className="flex items-center gap-x-2">
                <input
                  type="text"
                  className="w-full px-4 h-9 rounded-[44px] border border-light-input-border outline-none text-sm"
                  value={newName}
                  placeholder={username || "Create a username"}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <button
                  onClick={handleSaveUsername}
                  className={`${
                    !!newName
                      ? "bg-secondary cursor-pointer"
                      : "bg-primary cursor-default"
                  } rounded-[20px] bg-primary px-3 h-9 text-white text-sm`}
                >
                  Save
                </button>
              </label>
            )}
          </div>
          <button onClick={handleEditName}>
            {!isEditName ? (
              <EditIcon theme={theme} size={24} />
            ) : (
              <CancelIcon theme={theme} />
            )}
          </button>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center flex-col">
        <div className="flex py-8  flex-wrap items-center justify-center gap-8 max-w-[335px] mobile:max-w-[500px]">
          <button
            onClick={() => {
              selectImage("user1");
            }}
          >
            <Image
              alt="user"
              src={`/users/user1.svg`}
              width={120}
              height={120}
              className={`${
                selectedImage === "user1" ? "border-4 border-black" : ""
              } rounded-full`}
            />
          </button>
          <button
            onClick={() => {
              selectImage("user2");
            }}
          >
            <Image
              alt="user"
              src={`/users/user2.svg`}
              width={120}
              height={120}
              className={`${
                selectedImage === "user2" ? "border-4 border-black" : ""
              } rounded-full`}
            />
          </button>
          <button
            onClick={() => {
              selectImage("user3");
            }}
          >
            <Image
              alt="user"
              src={`/users/user3.svg`}
              width={120}
              height={120}
              className={`${
                selectedImage === "user3" ? "border-4 border-black" : ""
              } rounded-full`}
            />
          </button>
          <button
            onClick={() => {
              selectImage("user4");
            }}
          >
            <Image
              alt="user"
              src={`/users/user4.svg`}
              width={120}
              height={120}
              className={`${
                selectedImage === "user4" ? "border-4 border-black" : ""
              } rounded-full`}
            />
          </button>
          <button
            onClick={() => {
              selectImage("user5");
            }}
          >
            <Image
              alt="user"
              src={`/users/user5.svg`}
              width={120}
              height={120}
              className={`${
                selectedImage === "user5" ? "border-4 border-black" : ""
              } rounded-full`}
            />
          </button>
          <button
            onClick={() => {
              selectImage("user6");
            }}
          >
            <Image
              alt="user"
              src={`/users/user6.svg`}
              width={120}
              height={120}
              className={`${
                selectedImage === "user6" ? "border-4 border-black" : ""
              } rounded-full`}
            />
          </button>
        </div>
        <button
          onClick={handleSaveImage}
          className={`${
            !!selectedImage
              ? "bg-secondary cursor-pointer"
              : "bg-primary cursor-default"
          } rounded-[44px] w-[200px] bg-primary px-3 h-12 font-semibold text-white text-base`}
        >
          SAVE
        </button>
      </div>
    </div>
  );
};
