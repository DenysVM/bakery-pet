import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Image, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

function ProductModal({ isOpen, product, onClose }) {
    const modalRef = useRef();
    const { t, i18n } = useTranslation();

    if (!isOpen || !product) return null;

    return ReactDOM.createPortal(
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{product.name[i18n.language]}</ModalHeader>
                <ModalCloseButton />
                <ModalBody ref={modalRef}>
                    <Image src={`${process.env.PUBLIC_URL}${product.imageUrl}`} alt={t(`Picture of ${product.name[i18n.language]}`)} mb="4" />
                    <Text mb="2">{t('price')}: ${product.price}</Text>
                    <Text>{t('composition')}: {product.composition[i18n.language]}</Text>
                    <Text>{t('calories')}: {product.calories} kcal</Text>
                </ModalBody>
            </ModalContent>
        </Modal>,
        document.getElementById('modal-root')
    );
}

export default ProductModal;
