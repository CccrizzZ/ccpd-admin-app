import React from 'react'
import { DotLoader } from 'react-spinners'

type LoadingSpinerProp = {
    show: boolean
}

const LoadingSpiner: React.FC<LoadingSpinerProp> = ({ show }) => {
    if (show) {
        return (
            <div className='fixed h-screen w-full text-center select-none z-50 opacity-90 bg-neutral-800' >
                <div className='fixed' style={{ backgroundColor: '#000', borderRadius: '2em', display: 'inline-block', marginTop: '25vh', padding: '35px' }}>
                    <DotLoader color='#0d6efd' speedMultiplier={1.5} />
                    <h4 className='mt-5 text-white'>Loading...</h4>
                </div>
            </div>
        )
    }
}

export default LoadingSpiner
