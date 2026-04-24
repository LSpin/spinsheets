import { useState, useCallback } from 'react'

export default function useConfirm() {
  const [state, setState] = useState({ open: false, message: '', title: '', resolve: null })

  const confirm = useCallback((message, title = '') => {
    return new Promise(resolve => {
      setState({ open: true, message, title, resolve })
    })
  }, [])

  const handleConfirm = useCallback(() => {
    state.resolve?.(true)
    setState(s => ({ ...s, open: false }))
  }, [state.resolve])

  const handleCancel = useCallback(() => {
    state.resolve?.(false)
    setState(s => ({ ...s, open: false }))
  }, [state.resolve])

  return {
    confirm,
    confirmDialogProps: {
      open: state.open,
      message: state.message,
      title: state.title,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
    },
  }
}
