import jsPDF from 'jspdf';
import 'jspdf-autotable';
import i18n from '../i18n/i18n';
import { formatDate } from '../components/common/formatDate';

export const generateInvoicePDF = async (order, products) => {
  const t = i18n.t.bind(i18n);

  const translationKeys = {
    orderId: t('order.orderId'),
    date: t('order.date'),
    name: t('user.name'),
    phone: t('user.phone'),
    address: t('user.address'),
    novaPoshtaBranch: t('order.novaPoshtaBranch'),
    city: t('user.city'),
    street: t('user.street'),
    houseNumber: t('user.houseNumber'),
    apartmentNumber: t('user.apartmentNumber'),
    noData: t('user.noData'),
    deleted: t('user.deleted'),
    products: t('products'),
    quantity: t('order.quantity'),
    price: t('productCard.price'),
    totalPrice: t('cart.totalPrice'),
    total: t('order.total'),
    noProduct: t('order.noProduct'),
  };

  const doc = new jsPDF();

  try {
    const fontBuffer = await fetch(`${process.env.PUBLIC_URL}/fonts/DejaVuSans.ttf`).then((res) =>
      res.arrayBuffer()
    );
    const base64Font = arrayBufferToBase64(fontBuffer);
    doc.addFileToVFS('DejaVuSans.ttf', base64Font);
    doc.addFont('DejaVuSans.ttf', 'DejaVuSans', 'normal');
    doc.setFont('DejaVuSans', 'normal');
  } catch (error) {
    console.error('Ошибка подключения шрифта:', error);
    return;
  }

  doc.setFontSize(18);
  doc.text(`${translationKeys.orderId}: ${order.orderNumber}`, 14, 22);

  doc.setFontSize(12);
  doc.text(`${translationKeys.date}: ${formatDate(order.createdAt)}`, 14, 32);

  const customerName = order.user?.deleted
    ? `${order.userFirstName || translationKeys.noData} ${order.userLastName || ''} (${translationKeys.deleted})`
    : `${order.user?.firstName || order.userFirstName || translationKeys.noData} ${
        order.user?.lastName || order.userLastName || ''
      }`;

  const customerPhone = order.phone || translationKeys.noData;

  const deliveryAddress =
    order.deliveryType === 'Nova Poshta' && order.novaPoshtaDelivery?.label
      ? `${translationKeys.novaPoshtaBranch}: ${order.novaPoshtaDelivery.label}`
      : order.deliveryType === 'Home' && order.homeDelivery
      ? `${translationKeys.city}: ${order.homeDelivery.city || translationKeys.noData}, ${
          translationKeys.street
        }: ${order.homeDelivery.street || translationKeys.noData}, ${translationKeys.houseNumber}: ${
          order.homeDelivery.houseNumber || translationKeys.noData
        }, ${translationKeys.apartmentNumber}: ${
          order.homeDelivery.apartmentNumber || translationKeys.noData
        }`
      : translationKeys.noData;

  doc.text(`${translationKeys.name}: ${customerName}`, 14, 42);
  doc.text(`${translationKeys.phone}: ${customerPhone}`, 14, 52);
  doc.text(`${translationKeys.address}:`, 14, 62);

  // Добавление переноса длинных строк
  const splitAddress = doc.splitTextToSize(deliveryAddress, 180);
  doc.text(splitAddress, 14, 70);

  const validProducts = Array.isArray(products) ? products : [];
  const items =
    order.items?.map((item) => {
      let product = item.product;
      if (!product) {
        const productId = item.productId?._id || item.productId;
        product = validProducts.find((p) => p._id === productId);
      }

      const productName = product?.name
        ? product.name[i18n.language] || product.name['en'] || translationKeys.noProduct
        : translationKeys.noProduct;

      return [
        productName,
        item.quantity,
        item.price?.toFixed(2) || '0.00',
        (item.price * item.quantity)?.toFixed(2) || '0.00',
      ];
    }) || [];

  doc.autoTable({
    startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 80,
    head: [
      [
        translationKeys.products,
        translationKeys.quantity,
        translationKeys.price,
        translationKeys.totalPrice,
      ],
    ],
    body: items,
    styles: {
      font: 'DejaVuSans',
    },
  });

  const finalY = doc.lastAutoTable.finalY || 90;
  doc.text(`${translationKeys.total}: $${order.total?.toFixed(2) || '0.00'}`, 14, finalY + 10);

  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  
  const win = window.open(url, '_blank');
  
  if (!win || win.closed || typeof win.closed === 'undefined') {

    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${order.orderNumber}.pdf`;
    link.click();
  }

  URL.revokeObjectURL(url);
  
};

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
