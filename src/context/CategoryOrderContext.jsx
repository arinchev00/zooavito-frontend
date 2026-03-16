import React, { createContext, useState, useContext, useEffect } from 'react';

const CategoryOrderContext = createContext();

export const useCategoryOrder = () => useContext(CategoryOrderContext);

export const CategoryOrderProvider = ({ children }) => {
  // Загружаем настройки из localStorage при инициализации
  const [categoryOrder, setCategoryOrder] = useState(() => {
    const saved = localStorage.getItem('categoryOrder');
    return saved ? JSON.parse(saved) : [];
  });

  const [hiddenCategories, setHiddenCategories] = useState(() => {
    const saved = localStorage.getItem('hiddenCategories');
    return saved ? JSON.parse(saved) : [];
  });

  // Сохраняем в localStorage при изменениях
  useEffect(() => {
    localStorage.setItem('categoryOrder', JSON.stringify(categoryOrder));
  }, [categoryOrder]);

  useEffect(() => {
    localStorage.setItem('hiddenCategories', JSON.stringify(hiddenCategories));
  }, [hiddenCategories]);

  // Функция для обновления порядка категорий
  const updateCategoryOrder = (newOrder) => {
    setCategoryOrder(newOrder);
  };

  // Функция для скрытия/показа категории
  const toggleCategoryVisibility = (categoryId) => {
    setHiddenCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Функция для получения отсортированных и отфильтрованных категорий
  const getVisibleCategories = (allCategories) => {
    if (!allCategories) return [];
    
    // Сначала применяем пользовательский порядок, если есть
    let orderedCategories = [...allCategories];
    
    if (categoryOrder.length > 0) {
      orderedCategories.sort((a, b) => {
        const indexA = categoryOrder.indexOf(a.id);
        const indexB = categoryOrder.indexOf(b.id);
        
        if (indexA === -1 && indexB === -1) return a.id - b.id;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
    }

    // Фильтруем скрытые
    return orderedCategories.filter(cat => !hiddenCategories.includes(cat.id));
  };

  const value = {
    categoryOrder,
    hiddenCategories,
    updateCategoryOrder,
    toggleCategoryVisibility,
    getVisibleCategories
  };

  return (
    <CategoryOrderContext.Provider value={value}>
      {children}
    </CategoryOrderContext.Provider>
  );
};