/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/types/state";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { closeModal } from "@/redux/slices/modal/slice";
import { closeOverlay, openOverlay } from "@/redux/slices/overlaySlice";

export const ModalLayout = () => {
  const { modal } = useAppSelector((state) => state.modal);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!!modal) {
      dispatch(openOverlay());
    } else {
      dispatch(closeOverlay());
    }
  }, [modal]);

  const closeDropdown = () => {
    dispatch(closeModal());
  };

  const ref = useOutsideClick(closeDropdown, !!modal);
  return (
    <>
      <div ref={ref}>{modal}</div>
    </>
  );
};
