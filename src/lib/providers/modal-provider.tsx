// ============================================
// Modal Provider
// Production-ready modal management
// ============================================

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Modal {
  id: string;
  type: string;
  title?: string;
  content: React.ReactNode;
  props?: Record<string, any>;
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCloseButton?: boolean;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  isClosable?: boolean;
}

interface ModalContextType {
  modals: Modal[];
  activeModal: Modal | null;
  openModal: (modal: Omit<Modal, 'id' | 'isOpen'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  isModalOpen: (id: string) => boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
  storageKey?: string;
  maxModals?: number;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({
  children,
  storageKey = 'fee_modals',
  maxModals = 5,
}) => {
  const [modals, setModals] = useState<Modal[]>([]);

  const activeModal = modals.length > 0 ? modals[0] : null;

  const openModal = useCallback(
    (modalData: Omit<Modal, 'id' | 'isOpen'>): string => {
      const id = `modal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const modal: Modal = {
        ...modalData,
        id,
        isOpen: true,
      };

      setModals((prev) => {
        const updated = [modal, ...prev];
        if (updated.length > maxModals) {
          return updated.slice(0, maxModals);
        }
        return updated;
      });

      return id;
    },
    [maxModals]
  );

  const closeModal = useCallback((id: string) => {
    setModals((prev) => {
      const modal = prev.find((m) => m.id === id);
      if (modal?.onClose) {
        modal.onClose();
      }
      return prev.filter((m) => m.id !== id);
    });
  }, []);

  const closeAllModals = useCallback(() => {
    setModals((prev) => {
      prev.forEach((modal) => {
        if (modal.onClose) {
          modal.onClose();
        }
      });
      return [];
    });
  }, []);

  const isModalOpen = useCallback((id: string): boolean => {
    return modals.some((m) => m.id === id && m.isOpen);
  }, [modals]);

  const value: ModalContextType = {
    modals,
    activeModal,
    openModal,
    closeModal,
    closeAllModals,
    isModalOpen,
  };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const useActiveModal = (): Modal | null => {
  const { activeModal } = useModal();
  return activeModal;
};

export const useIsModalOpen = (id: string): boolean => {
  const { isModalOpen } = useModal();
  return isModalOpen(id);
};