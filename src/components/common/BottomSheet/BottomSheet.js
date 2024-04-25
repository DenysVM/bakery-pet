import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Box, Image, Text, useColorModeValue, CloseButton } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { useEscapeKey, useClickOutside } from '../../../utils/keyboardUtils';
import { useLockBodyScroll } from '../../../utils/useLockBodyScroll';

function BottomSheet({ isOpen, product, onClose }) {
    const { t, i18n } = useTranslation();
    const bg = useColorModeValue('white', 'gray.800');
    const color = useColorModeValue('gray.800', 'white');
    const ref = useRef();
    const [showGripIndicator, setShowGripIndicator] = useState(false);

    useLockBodyScroll(isOpen);
    useEscapeKey(onClose);
    useClickOutside(ref, onClose);

    const [{ y }, api] = useSpring(() => ({
        y: window.innerHeight
    }), [isOpen]);

    const bind = useDrag(({ down, movement: [_, my], velocity, direction: [, yDir] }) => {
        setShowGripIndicator(down);
        if (down) {
            api.start({ y: my, immediate: true });
        } else if (my > window.innerHeight / 4 || (velocity > 0.5 && yDir > 0)) {
            onClose();
        } else {
            api.start({ y: 0, immediate: false });
        }
    }, { from: () => [0, y.get()] });

    useEffect(() => {
        api.start({ y: isOpen ? 0 : window.innerHeight });
    }, [isOpen, api]);

    const bottomSheetStyle = {
        transform: y.to(y => `translateY(${y}px)`),
        touchAction: 'none',
        position: 'fixed',
        left: '5px',
        right: '5px',
        bottom: 0,
        zIndex: 1500,
    };

    const gripIndicatorStyle = {
        width: '40px',
        height: '4px',
        backgroundColor: 'rgba(128, 128, 128, 0.5)',
        borderRadius: '2px',
        position: 'absolute',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        visibility: showGripIndicator ? 'visible' : 'hidden'
    };

    const boxStyle = {
        bg: bg,
        color: color,
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.4)',
        p: "6",
        maxW: "95vh",
        m: "auto",
        position: "relative",
        border: '0.1px solid',
        borderBottom: "none",
        borderColor: useColorModeValue('#A0AEC0', '#CBD5E0')
    };

    const closeIconStyle = {
        position: 'absolute',
        right: '1rem',
        top: '1rem',
        zIndex: 1600,
        borderRadius: '50%',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
        backgroundColor: useColorModeValue('rgba(237, 242, 247, 0.8)', 'rgba(74, 85, 104, 0.8)'),
        color: useColorModeValue('#A0AEC0', '#CBD5E0'), 
        border: '1px solid',
        borderColor: useColorModeValue('#A0AEC0', '#CBD5E0') 
    };
    
      
    if (!isOpen || !product) return null;

    return ReactDOM.createPortal(
        <>
            <div className="bottom-sheet-backdrop" onClick={onClose}></div>
            <animated.div className="bottom-sheet" ref={ref} {...bind()} style={bottomSheetStyle}>
                <Box {...boxStyle}>
                    <CloseButton style={closeIconStyle} onClick={onClose} />
                    <div style={gripIndicatorStyle}></div>
                    <Image src={`${process.env.PUBLIC_URL}${product.imageUrl}`} borderRadius="lg" alt={t(`Picture of ${product.name[i18n.language]}`)} />
                    <Text fontWeight="bold" mt="2">
                        {product.name[i18n.language]}
                    </Text>
                    <Text fontSize="md">{product.description[i18n.language]}</Text>
                    <Text mt="2">{t('price')}: ${product.price}</Text>
                    <Text>{t('composition')}: {product.composition[i18n.language]}</Text>
                    <Text>{t('calories')}: {product.calories} kcal</Text>
                </Box>
            </animated.div>
        </>,
        document.getElementById('modal-root')
    );
}

export default BottomSheet;