import Modal from './Modal'

// Confirmation Modal
export default function ConfirmModal({
    title = 'are you sure?',
    message,
    confirmLabel = 'Delete',
    cancelLabel = 'Keep it',
    altLabel,
    onConfirm,
    onCancel,
    onAlt,
}) {
    return (
        <Modal title={title} onClose={onCancel} width='w-120'>
            <p className='mb-4 text-sm'>{message}</p>
            <div className='flex flex-wrap justify-end gap-2'>
                <button type='button' className='softButton min-w-24' onClick={onCancel}>
                    {cancelLabel}
                </button>
                {/* alternative action primary action */}
                {altLabel &&
                    <button type='button' className='softButton min-w-24' onClick={onAlt}>
                        {altLabel}
                    </button>}
                <button type='button' className='softButton min-w-24 text-failure' onClick={onConfirm}>
                    {confirmLabel}
                </button>
            </div>
        </Modal>
    )
}
