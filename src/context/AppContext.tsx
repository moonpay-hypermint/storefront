import { createContext, FC, useMemo, useState } from 'react';
import LoadingPage from '../pages/LoadingPage';
import { AppComponents, IAppContext, IAppProvider } from '../types/context/IAppContext';

export const AppContext = createContext<IAppContext>({} as IAppContext);

export const AppProvider: FC<IAppProvider> = ({ children }) => {
    const [hasLoaded, setHasLoaded] = useState(false);
    const [loadedComponents, setLoadedComponents] = useState<AppComponents[]>([]);

    const hasFinishedLoading = useMemo(() => {
        if (hasLoaded) return true;

        const requiredLoadedComponents = Object.keys(AppComponents);

        const isFinishedLoading = requiredLoadedComponents.length === loadedComponents.length
            && requiredLoadedComponents.every((v, i) => v === loadedComponents[i]);

        setHasLoaded(isFinishedLoading);
        return isFinishedLoading;
    }, [loadedComponents, hasLoaded]);

    return (
        <>
            <LoadingPage
                hasFinishedLoading={hasFinishedLoading}
            />

            <AppContext.Provider value={{ loadedComponents, setLoadedComponents }}>
                {children}
            </AppContext.Provider>
        </>
    );
};