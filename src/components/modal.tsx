import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import type { ReactNode, RefObject } from 'react'
import { MdClose } from 'react-icons/md'

export interface ModalMethods {
  toggleModal: () => void
  openModal: () => void
  closeModal: () => void
}

export interface ModalProps {
  children: ReactNode
}

export const Modal = forwardRef<ModalMethods, ModalProps>((props, ref) => {
  const [visible, setVisible] = useState<boolean>(false)

  const toggleModal = useCallback(() => {
    setVisible(state => !state)
  }, [])

  const openModal = useCallback(() => {
    setVisible(true)
  }, [])

  const closeModal = useCallback(() => {
    setVisible(false)
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      toggleModal,
      openModal,
      closeModal,
    }),
    [toggleModal, openModal, closeModal]
  )

  return (
    !!visible && (
      <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center">
        <div
          role="button"
          tabIndex={0}
          className="absolute inset-0 cursor-default bg-black/40"
          onClick={closeModal}
        />
        <div className="relative z-10 rounded bg-white pt-7 ring-4 ring-teal-500">
          <button
            type="button"
            className="absolute right-2 top-1 text-zinc-500 transition hover:text-zinc-700"
            title="Fechar modal"
            onClick={closeModal}
          >
            <MdClose size={24} />
          </button>
          <div className="thin-scroll max-h-[80vh] w-screen max-w-[90vw] overflow-auto p-4 pt-0 lg:w-fit">
            {props.children}
          </div>
        </div>
      </div>
    )
  )
})

export function useModal(): RefObject<ModalMethods> {
  return useRef<ModalMethods>(null)
}
