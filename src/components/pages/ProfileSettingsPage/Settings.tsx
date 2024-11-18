import { BackIcon } from "@/assets/svg/BackIcon";
import { setImage } from "@/redux/slices/session/slice";
import { ImageType } from "@/types/messages";
import { useAppDispatch, useAppSelector } from "@/types/state";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export const Settings = () => {
  const router = useRouter();

  const { theme } = useTheme();

  const dispatch = useAppDispatch();

  const { image, publicKeyBase58 } = useAppSelector((state) => state.session);

  const [selectedImage, setSelectedImage] = useState<ImageType>(image);

  const handleBack = () => {
    router.back();
  };

  const selectImage = (image: ImageType) => {
    setSelectedImage(image);
  };

  const handleSaveImage = () => {
    dispatch(setImage(selectedImage));
    toast.success("Image saved successfully!", {
      position: "top-right",
    });
  };
  return (
    <div className="p-6 flex flex-col">
      <button className="ml-20" onClick={handleBack}>
        <BackIcon theme={theme} />
      </button>
      <div className="flex flex-col justify-center mobile:flex-row items-center gap-x-4 mt-6 px-4">
        <Image alt="user" src={`/users/${image}.svg`} width={72} height={72} />
        <div className="flex items-start gap-x-2.5">
          <div className={` flex-1 py-1 flex flex-col gap-y-2`}>
            <p
              className={` font-semibold  text-light-chats-text dark:text-white text-sm `}
            >
              {publicKeyBase58?.slice(0, 24) +
                "..." +
                publicKeyBase58?.slice(-12)}
            </p>
          </div>
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
