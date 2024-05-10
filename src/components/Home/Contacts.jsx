import React from 'react';
import { Box, Text, Link, Icon, HStack, VStack, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Divider } from '@chakra-ui/react';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Contacts = () => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const openMapModal = () => {
    onOpen();
  };

  return (
    <Box
      p={5}
      boxShadow="md"
      borderRadius="lg"
      w="full"
      maxWidth="960px"
      mx="auto"
    >
      <VStack spacing={3} align="stretch">
        <Text fontSize="lg" fontWeight="bold" textAlign="center">{t('contacts.socialMedia')}</Text>
        <HStack justify="center" spacing={4}>
          <Link href="https://www.facebook.com" isExternal><Icon as={FaFacebookF} boxSize={6} /></Link>
          <Link href="https://www.instagram.com" isExternal><Icon as={FaInstagram} boxSize={6} /></Link>
          <Link href="https://www.twitter.com" isExternal><Icon as={FaTwitter} boxSize={6} /></Link>
        </HStack>
        <Divider/>
        <Text fontSize="lg" textAlign="center" mb={2} >
          {t('contacts.address')}: <Text as="span" _hover={{ textDecoration: "underline" }} cursor="pointer" onClick={openMapModal}>
          Wołosка 12, 02-675 Warszawa</Text>
        </Text>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t('contacts.address')}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <iframe
                title="Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9784.5076856815!2d20.998149102073963!3d52.18656562105436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471eccf30d8d5ef7%3A0x23b86eb563b8bbf6!2sWestfield%20Mokot%C3%B3w!5e0!3m2!1sru!2spl!4v1712742948653!5m2!1sru!2spl&amp;zoom=15&amp;controls=1"                width="100%"
                height="450"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen=""
                loading="lazy"
                allow="fullscreen; accelerometer; gyroscope; magnetometer"
              ></iframe>
            </ModalBody>
          </ModalContent>
        </Modal>
        <Text fontSize="lg" textAlign="center">{t('contacts.phone')}: <Link href="tel:+48123456789">+48 123 456 789</Link></Text>
        <Text fontSize="lg" textAlign="center">{t('contacts.email')}: <Link href="mailto:bakery@example.com">bakery@example.com</Link></Text>
      </VStack>
    </Box>
  );
};

export default Contacts;
