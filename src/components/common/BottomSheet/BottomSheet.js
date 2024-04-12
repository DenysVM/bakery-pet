import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { animated, useSpring } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import '../../../styles/BottomSheet.css';
import { useEscapeKey, useClickOutside } from '../../../utils/keyboardUtils';
import { useLockBodyScroll } from '../../../utils/useLockBodyScroll';

function BottomSheet({ isOpen, car, onClose }) {
    const ref = useRef();
    useLockBodyScroll(isOpen);
    useEscapeKey(onClose);
    useClickOutside(ref, onClose);

    const [{ y }, api] = useSpring(() => ({ y: window.innerHeight }));

    const bind = useDrag(({ down, movement: [_, my], velocity, direction: [, yDir] }) => {
        if (down) {
            api.start({ y: my, immediate: true });
        } else if (my > window.innerHeight / 4 || (velocity > 0.5 && yDir > 0)) {
            onClose();
        } else {
            api.start({ y: 0, immediate: false });
        }
    }, { from: () => [0, y.get()] });

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('no-scroll');
            api.start({ y: 0 });
        } else {
            document.body.classList.remove('no-scroll');
            api.start({ y: window.innerHeight });
        }
    }, [isOpen, api]);

    if (!isOpen || !car) return null;

    return ReactDOM.createPortal(
        <>
            <div className="bottom-sheet-backdrop" onClick={onClose}></div>
            <animated.div className="bottom-sheet" ref={ref} {...bind()} style={{ transform: y.to(y => `translateY(${y}px)`) }}>
                <div className="bottom-sheet-content">
                    <div className="bottom-sheet-grip-indicator"></div>
                    <img className="bottom-sheet-car-image" src={car.img} alt={`${car.make} ${car.model}`} />
                    <p className="bottom-sheet-car-make">
                        {car.make} <span style={{ color: '#3470FF' }}>{car.model}</span>, {car.year}
                    </p>
                    <div className="car-details">
                        <div className="car-detail">{car.address.split(',')[1].trim()}</div>
                        <div className="car-detail">{car.address.split(',')[2].trim()}</div>
                        <div className="car-detail">Id: {car.id}</div>
                        <div className="car-detail">Year: {car.year}</div>
                        <div className="car-detail">Type: {car.type}</div>
                        <div className="car-detail">Fuel Consumption: {car.fuelConsumption}</div>
                        <div className="car-detail">Engine Size: {car.engineSize}</div>
                    </div>
                    <div className="modal-car-description">{car.description}</div>
                    <div className="car-accessories">Accessories and functionalities:
                        <div className="accessories">{car.accessories.map((item, index) => (
                            <React.Fragment key={index}>
                                {item}
                                {index !== car.accessories.length - 1 && <span className="accessories-separator"> | </span>}
                            </React.Fragment>
                        ))}</div>
                        <div className="functionalities">
                            {car.functionalities.map((item, index) => (
                                <React.Fragment key={index}>
                                    {item}
                                    {index !== car.functionalities.length - 1 && <span className="accessories-separator"> | </span>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div className="modal-car-title">Rental Conditions:</div>
                    <div className="modal-car-conditions">
                        {car.rentalConditions.split('\n').map((condition, index) => (
                            <div key={index} className="rental-condition">
                                {condition}
                            </div>
                        ))}
                        <div className="rental-condition">Mileage: <span style={{ color: '#3470FF' }}>{car.mileage.toLocaleString()}</span></div>
                        <div className="rental-condition">Price: <span style={{ color: '#3470FF' }}>{car.rentalPrice}</span></div>
                    </div>
                    <div className="rental-button">
                        <a href="tel:+380730000000" className="rental-link">Rental car</a>
                    </div>
                </div>
            </animated.div>
        </>,
        document.getElementById('bottom-sheet-root')
    );
}

export default BottomSheet;
