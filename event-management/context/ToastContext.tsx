import React, { createContext, useContext, ReactNode } from 'react';
import { Vibration } from 'react-native';
import Toast, { ToastShowParams } from 'react-native-toast-message';

interface ToastContextType {
  showToast: (params: ToastShowParams) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);


/**
 * Provides the toast context to its children.
 *
 * This component wraps your app component and provides the `showToast` and `hideToast` functions to its children.
 * These functions are used to display and hide toast messages.
 * @author Dev Muliya
 *
 * @example
 * import { ToastProvider } from '@/context/ToastContext';
 *
 * const App = () => {
 *   return (
 *     <ToastProvider>
 *       <MyApp />
 *     </ToastProvider>
 *   );
 * };
 *
 * @param {ReactNode} children - The children elements to wrap.
 * @returns {ReactElement} A ToastContext.Provider component.
 */
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const showToast = (params: ToastShowParams) => {
    if(params.type == "error"){
      Vibration.vibrate(200);
    }
    Toast.show({
      ...params, 
      text1Style: {
        fontSize: 14,
      },
      visibilityTime: (params.type == "error")  ? 6000 : 4000,
    });
  };

  const hideToast = () => {
    Toast.hide();
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast/>
    </ToastContext.Provider>
  );
};

/**
 * Custom hook to access the toast context.
 * 
 * This hook provides the `showToast` and `hideToast` functions to display and hide toast messages.
 * It must be used within a `ToastProvider`.
 * @author Dev Muliya
 * 
 * @throws Will throw an error if used outside of a `ToastProvider`.
 * @returns An object containing `showToast` and `hideToast` functions.
 */
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
