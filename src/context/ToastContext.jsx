import { createContext, useContext, useState } from "react";
import Toast from "../components/Toast";

/*createContext → Used to create a global storage

useContext → Used to read from that storage

useState → Used to store current toast message

Toast → The UI component that shows popup*/
//We are preparing tools to create a global notification system.


/*
|--------------------------------------------------------------------------
| Create Context
|--------------------------------------------------------------------------

What is this?

We are creating a box.

This box can store:

Functions

Data

Values

Right now it is empty.

Think of it like:

A global container that any component can access.
*/

const ToastContext = createContext();

/*
|--------------------------------------------------------------------------
| Toast Provider
|--------------------------------------------------------------------------
| Wraps entire app
| Provides showToast function globally
|--------------------------------------------------------------------------
*/

export const ToastProvider = ({children})=> {
    const [toast, setToast] = useState(null);

    /*
    showToast(message, type)
    type: success | error
  */

    const showToast = (message, type = "success")=>{
        setToast({message,type});

        // Auto remove after 3 seconds
        setTimeout(() => {
             setToast(null);
        }, 3000);
    };

    return(
        <ToastContext.Provider value={{showToast}}>
            {children}

            {toast && (
                <Toast message={toast.message} type={toast.type}/>
            )}
        </ToastContext.Provider>
    )
};
/*
|--------------------------------------------------------------------------
| Custom Hook for using Toast
|--------------------------------------------------------------------------
*/

export const useToast = () => {
  return useContext(ToastContext);
};