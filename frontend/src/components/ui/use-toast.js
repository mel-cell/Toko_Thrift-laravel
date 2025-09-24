import * as React from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

const toastTimeouts = new Map()

const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({ type: "REMOVE_TOAST", toastId: toastId })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

const removeFromRemoveQueue = (toastId) => {
  const timeout = toastTimeouts.get(toastId)

  if (timeout) {
    clearTimeout(timeout)
    toastTimeouts.delete(toastId)
  }
}

export const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST":
      const { toastId } = action

      // ! Side effect ! - This could be cleaner in a perfect world
      removeFromRemoveQueue(toastId)

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId ? { ...t, open: false } : t
        ),
      }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
    default:
      return state
  }
}

const listeners = []

let state = {
  toasts: [],
}

function setState(action) {
  state = reducer(state, action)
  listeners.forEach((listener) => listener(state))
}

function dispatch(action) {
  if (action.toastId) {
    switch (action.type) {
      case "ADD_TOAST":
        addToRemoveQueue(action.toastId)
        break
      case "DISMISS_TOAST":
        removeFromRemoveQueue(action.toastId)
        break
      default:
        break
    }
  }

  setState(action)
}

function createToastFunction(type) {
  return function toast({
    ...props
  }) {
    const id = genId()
    const update = (props) =>
      dispatch({ type: "UPDATE_TOAST", toast: { props, id } })
    const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })
    dispatch({ type: "ADD_TOAST", toast: { ...props, id, open: true, type } })
    return { id, update, dismiss }
  }
}

const toast = createToastFunction("default")
toast.success = createToastFunction("success")
toast.destructive = createToastFunction("destructive")

function useToast() {
  const [toastState, setToastState] = React.useState(state)

  React.useEffect(() => {
    const listener = (state) => setToastState(state)
    listeners.push(listener)
    return () => {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    ...toastState,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { toast, useToast }
