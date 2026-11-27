import { createElement } from '../../utils/dom';
import './modal.css';

const TITLE_ID = 'modal-title';

export interface ModalDialog {
  readonly element: HTMLDialogElement;
  readonly content: HTMLElement;
  readonly show: () => void;
  readonly hide: () => void;
  readonly setTitle: (title: string) => void;
}

export interface ModalDialogOptions {
  readonly onClose?: () => void;
}

export function createDialogModal(
  initialTitle: string,
  // isOpen: boolean,
  options?: ModalDialogOptions,
): ModalDialog {
  const closeButton: HTMLButtonElement = createElement('button', {
    className: 'close-btn',
    text: '×',
    attributes: {
      id: 'close-modal',
      type: 'button',
      'aria-label': 'Close dialog',
    },
  });

  const modalTitle: HTMLHeadingElement = createElement('h2', {
    text: initialTitle,
    attributes: { id: TITLE_ID },
  });

  const content: HTMLDivElement = createElement('div', {
    className: 'modal-content',
  });

  const dialog: HTMLDialogElement = createElement('dialog', {
    className: 'modal-dialog',
    attributes: { 'aria-labelledby': TITLE_ID },
    children: [closeButton, modalTitle, content],
  });

  const show = (): void => {
    if (!dialog.open) {
      dialog.showModal();
    }
  };

  const hide = (): void => {
    if (dialog.open) {
      dialog.close();
    }
  };

  const setTitle = (title: string): void => {
    modalTitle.textContent = title;
  };

  function isClickOutsideRect(event: MouseEvent, rect: DOMRect): boolean {
    return (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    );
  }

  closeButton.addEventListener('click', (): void => {
    hide();
  });

  // Close <dialog> on click outside of content
  dialog.addEventListener('click', (event: MouseEvent): void => {
    if (event.target !== dialog) {
      return;
    }

    const rect: DOMRect = dialog.getBoundingClientRect();
    if (isClickOutsideRect(event, rect)) {
      hide();
    }
  });

  // Close should work on Escape
  dialog.addEventListener('close', (): void => {
    options?.onClose?.();
  });

  // if (isOpen) {
  //   show();
  // }

  return {
    element: dialog,
    content,
    show,
    hide,
    setTitle,
  };
}
