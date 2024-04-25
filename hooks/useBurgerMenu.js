import { useState } from "react"

export const useBurgerMenu = () => {
    const [open, setOpen] = useState(false);

    const updateOpen = (openStatus) => {
        setOpen(openStatus);
    };


    return {
        open,
        updateOpen,
    };
};