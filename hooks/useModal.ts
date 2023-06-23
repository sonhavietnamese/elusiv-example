import { create } from 'zustand'

type ModalState = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const useModal = create<ModalState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}))

export default useModal
