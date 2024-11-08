import jsPDF from 'jspdf';
import 'jspdf-autotable';
import i18n from '../i18n/i18n';
import { formatDate } from '../components/common/formatDate';
import DejaVuSans from '../utils/fonts/DejaVuSans-normal';

export const generateInvoicePDF = (order, products) => {
  const t = i18n.t.bind(i18n);

  const doc = new jsPDF();

  // Настройка шрифта
  try {
    doc.addFileToVFS('DejaVuSans.ttf', DejaVuSans);
    doc.addFont('DejaVuSans.ttf', 'DejaVuSans', 'normal');
    doc.setFont('DejaVuSans', 'normal');
  } catch (error) {
    console.error('Ошибка добавления шрифта:', error);
  }

  // Заголовки и основные сведения
  doc.setFontSize(18);
  doc.text(`${t('order.orderId')}: ${order._id}`, 14, 22);

  doc.setFontSize(12);
  doc.text(`${t('order.date')}: ${formatDate(order.createdAt)}`, 14, 32);

  const customerName = order.user
    ? `${order.user.firstName} ${order.user.lastName}`
    : t('user.noData');
  const address = order.address || {};
  const deliveryAddress = `${t('user.city')} ${address.city || ''}, ${t('user.street')} ${address.street || ''}, ${t('user.houseNumber')} ${address.houseNumber || ''}, ${t(
    'user.apartmentNumber'
  )} ${address.apartmentNumber || ''}`;
  const customerPhone = order.phone || t('user.noData');

  doc.text(`${t('user.name')}: ${customerName}`, 14, 42);
  doc.text(`${t('user.phone')}: ${customerPhone}`, 14, 52);
  doc.text(`${t('user.address')}:`, 14, 62);
  doc.text(deliveryAddress, 14, 70);

  // Таблица товаров
  const validProducts = Array.isArray(products) ? products : [];
  const items = order.items?.map((item) => {
    let product = item.product;
    if (!product) {
      const productId = item.productId?._id || item.productId;
      product = validProducts.find((p) => p._id === productId);
    }

    const productName = product && product.name
      ? product.name[i18n.language] || product.name['en'] || t('order.noProduct')
      : t('order.noProduct');

    return [
      productName,
      item.quantity,
      item.price?.toFixed(2) || '0.00',
      (item.price * item.quantity)?.toFixed(2) || '0.00',
    ];
  }) || [];

  doc.autoTable({
    startY: 80,
    head: [[t('products'), t('order.quantity'), t('productCard.price'), t('cart.totalPrice')]],
    body: items,
    styles: {
      font: 'DejaVuSans',
    },
  });

  // Итого
  const finalY = doc.lastAutoTable.finalY || 90;
  doc.text(`${t('order.total')}: $${order.total?.toFixed(2) || '0.00'}`, 14, finalY + 10);

  // Создание Blob и открытие в новом окне
  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  URL.revokeObjectURL(url);
};
