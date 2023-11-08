import React from 'react'
import { Spinner } from 'react-bootstrap'

type LoadingSpinerProp = {
    show: boolean
}

const LoadingSpiner: React.FC<LoadingSpinerProp> = ({ show }) => {
    if (show) {
        return (
            <div style={{ width: '100%', height: '100%', textAlign: 'center', backgroundColor: '#222', zIndex: '10', position: 'absolute', opacity: '0.9' }}>
                <div style={{ backgroundColor: '#000', borderRadius: '2em', display: 'inline-block', marginTop: '25vh', padding: '35px' }}>
                    <Spinner animation="border" variant="success" style={{ width: '50px', height: '50px', margin: 'auto' }} />
                    <h4 style={{ color: 'white' }}>Loading...</h4>
                </div>
            </div>
        )
    }
}

export default LoadingSpiner

