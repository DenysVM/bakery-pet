import React, { useState } from 'react';
import { FormControl, FormLabel, Textarea, FormHelperText } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const CheckoutComment = ({ onCommentChange }) => {
  const { t } = useTranslation(); 
  const [comment, setComment] = useState('');
  const maxCommentLength = 200;

  const handleCommentChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxCommentLength) {
      setComment(value);
      onCommentChange(value); 
    }
  };

  return (
    <FormControl>
      <FormLabel>{t('checkout.commentLabel')}</FormLabel>
      <Textarea
        value={comment}
        onChange={handleCommentChange}
        placeholder={t('checkout.commentPlaceholder')}
        size="md"
        resize="vertical"
        focusBorderColor="teal.500"
      />
      <FormHelperText>
        {t('checkout.characterCount', { current: comment.length, max: maxCommentLength })}
      </FormHelperText>
    </FormControl>
  );
};

export default CheckoutComment;
