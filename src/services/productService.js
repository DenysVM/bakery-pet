export const loadProducts = async () => {
    try {
      const response = await fetch(`${process.env.PUBLIC_URL}/products.json`);
      const products = await response.json();
      return products;
    } catch (error) {
      console.error('Error loading products:', error);
      throw error;
    }
  };
  