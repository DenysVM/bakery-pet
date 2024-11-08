// utils/productUtils.js
export const filterProducts = (products, filterParams) => {
    return products.filter((product) => {
      const categoryMatch = filterParams.category === '' || product.category === filterParams.category;
      const priceMatch =
        (!filterParams.minPrice || product.price >= Number(filterParams.minPrice)) &&
        (!filterParams.maxPrice || product.price <= Number(filterParams.maxPrice));
      const calorieMatch =
        (!filterParams.minCalories || product.calories >= Number(filterParams.minCalories)) &&
        (!filterParams.maxCalories || product.calories <= Number(filterParams.maxCalories));
      return categoryMatch && priceMatch && calorieMatch;
    });
  };
  
  export const sortProducts = (products, criteria) => {
    return [...products].sort((a, b) => {
      if (criteria === 'price_asc') {
        return a.price - b.price;
      } else if (criteria === 'price_desc') {
        return b.price - a.price;
      } else if (criteria === 'calories_asc') {
        return a.calories - b.calories;
      } else if (criteria === 'calories_desc') {
        return b.calories - a.calories;
      }
      return 0;
    });
  };
  