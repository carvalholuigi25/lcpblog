import { useEffect, useState } from 'react';
import { Ring, Tailspin, DotPulse } from 'ldrs/react';
import { getFromStorage } from '@applocale/hooks/localstorage';
import { useTranslations } from 'next-intl';

export interface LoadingCompProps {
    type: string;
    icontype?: string;
}

export default function LoadingComp({type, icontype}: LoadingCompProps) {
    const t = useTranslations("ui.loading");
    const [icolor, setIColor] = useState("black");

    useEffect(() => {
        if(!icolor) {
            setIColor(getIconThemeColor());
        }
    }, [icolor])

    const getIconThemeColor = () => {
        return getFromStorage('theme')! && !!["dark"].includes(getFromStorage('theme')!) ? 'white' : 'black';
    }

    const cardContent = () => {
        return (
            <div className='col-12 card p-3 text-center'>
                <div className='card-body'>
                    <i className="bi-clock" style={{ fontSize: "4rem" }}></i>
                    <p>{t('title') ?? "Loading..."}</p>
                </div>
            </div>
        )
    }

    const icoRing = () => {
        return (        
            <Ring size={40} stroke={5} bg-opacity={0} speed={2} color={icolor} />
        )
    }

    const icoTailSpin = () => {
        return (
            <Tailspin size={40} stroke={5} bg-opacity={0} speed={2} color={icolor} />
        )
    }

    const icoDotPulse = () => {
        return (
            <DotPulse size={40} bg-opacity={0} speed={1.3} color={icolor} />
        )
    }

    const iconContent = () => {
        return (
            <>
                {!icontype && icoRing()}
                {!!icontype && (
                    <>
                        {icontype == 'ring' && icoRing()}
                        {icontype == 'tailspin' && icoTailSpin()}
                        {icontype == 'dotpulse' && icoDotPulse()}
                    </>
                )}
            </>
        )
    }

    const content = () => {
        return (
            <>
                {!type && cardContent()}
                {!!type && (
                    <>
                        {type == 'text' && cardContent()}
                        {type == 'icon' && iconContent()}
                    </>
                )}
            </>
        )
    }
    
    return (
        <div className='container w-auto'>
            <div className='row justify-content-center align-items-center p-3'>
                {content()}
            </div>
        </div>
    );
}