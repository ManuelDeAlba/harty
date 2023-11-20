import { useEffect } from 'react';

export default function useTitle(titulo){
    useEffect(() => {
        const ultimoTitulo = document.title;

        document.title = titulo;

        return () => {
            document.title = ultimoTitulo;
        }
    }, [titulo]);
}