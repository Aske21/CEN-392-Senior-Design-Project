import { useCallback, useState } from "react";

export type useDisclosureType = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
};

const useDisclosure = (defaultIsOpen = false): useDisclosureType => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onToggle = useCallback(
    () => setIsOpen((prevIsOpen) => !prevIsOpen),
    []
  );

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
  };
};

export default useDisclosure;
