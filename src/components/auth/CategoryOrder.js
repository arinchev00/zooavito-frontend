import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCategoryOrder } from '../../context/CategoryOrderContext';
import { useCategories } from '../../context/CategoryContext';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';
import SortableItem from './SortableItem';
import './CategoryOrder.css';

const CategoryOrder = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { categories, refreshCategories } = useCategories();
  const { categoryOrder, updateCategoryOrder, hiddenCategories, toggleCategoryVisibility } = useCategoryOrder();
  
  const [orderedCategories, setOrderedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeId, setActiveId] = useState(null);
  
  const initialLoadDone = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Проверка прав доступа
  useEffect(() => {
    if (!isAuthenticated || user?.email !== 'admin123@admin.com') {
      navigate('/announcements');
    }
  }, [isAuthenticated, user, navigate]);

  // Загружаем данные только один раз при монтировании
  useEffect(() => {
    const loadInitialData = async () => {
      if (initialLoadDone.current) return;
      
      setLoading(true);
      try {
        if (refreshCategories) {
          await refreshCategories();
        }
        initialLoadDone.current = true;
      } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
        setError('Не удалось загрузить категории');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []); // Пустой массив зависимостей - выполнится только один раз

  // Применяем сохраненный порядок к категориям
  useEffect(() => {
    if (categories && categories.length > 0) {
      let sorted = [...categories];
      
      if (categoryOrder.length > 0) {
        sorted.sort((a, b) => {
          const indexA = categoryOrder.indexOf(a.id);
          const indexB = categoryOrder.indexOf(b.id);
          
          if (indexA === -1 && indexB === -1) return a.id - b.id;
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });
      }
      
      setOrderedCategories(sorted);
    }
  }, [categories, categoryOrder]);

  // Начало перетаскивания
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // Обработка перетаскивания
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    if (active.id !== over.id) {
      setOrderedCategories((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        console.log('Перемещение:', {
          item: items[oldIndex].title,
          from: oldIndex,
          to: newIndex
        });
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Сохранение порядка
  const handleSaveOrder = () => {
    try {
      setSaving(true);
      
      const newOrder = orderedCategories.map(cat => cat.id);
      updateCategoryOrder(newOrder);
      
      setSuccess('Порядок категорий успешно сохранен');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Ошибка при сохранении порядка:', error);
      setError('Не удалось сохранить порядок категорий');
    } finally {
      setSaving(false);
    }
  };

  // Сброс к исходному порядку (по id)
  const handleReset = () => {
    const defaultOrder = [...categories].sort((a, b) => a.id - b.id);
    setOrderedCategories(defaultOrder);
    updateCategoryOrder(defaultOrder.map(c => c.id));
  };

  // Переключение видимости категории
  const handleToggleVisibility = (categoryId) => {
    toggleCategoryVisibility(categoryId);
  };

  if (!isAuthenticated || user?.email !== 'admin123@admin.com') {
    return null;
  }

  if (loading && !orderedCategories.length) {
    return (
      <div className="category-order-page">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="sr-only">Загрузка...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="category-order-page">
      <div className="container">
        <div className="page-header">
          <h1>Порядок отображения категорий в шапке</h1>
          <button 
            onClick={() => navigate('/admin')} 
            className="btn btn-secondary"
          >
            ← Назад к панели админа
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="order-instructions">
          <p>
            <i className="fas fa-info-circle"></i>
            Перетаскивайте категории мышкой, чтобы изменить их порядок отображения в шапке сайта.
            Категории, расположенные выше, будут отображаться левее.
          </p>
        </div>

        <div className="order-container">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext
              items={orderedCategories.map(c => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="categories-list">
                {orderedCategories.map((category, index) => (
                  <SortableItem 
                    key={category.id} 
                    id={category.id} 
                    category={category}
                    index={index}
                    isHidden={hiddenCategories.includes(category.id)}
                    onToggleVisibility={handleToggleVisibility}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className="order-actions">
          <button
            onClick={handleSaveOrder}
            className="btn btn-success"
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Сохранение...
              </>
            ) : (
              'Сохранить порядок'
            )}
          </button>
          <button
            onClick={handleReset}
            className="btn btn-secondary"
            disabled={saving}
          >
            Сбросить
          </button>
        </div>

        <div className="preview-note">
          <h3>Как это будет выглядеть в шапке:</h3>
          <div className="preview-header">
            {orderedCategories
              .filter(cat => !hiddenCategories.includes(cat.id))
              .slice(0, 5)
              .map((cat, index, filtered) => (
                <span key={cat.id} className="preview-item">
                  {cat.title}
                  {index < filtered.length - 1 && ' | '}
                </span>
              ))}
            {orderedCategories.filter(cat => !hiddenCategories.includes(cat.id)).length > 5 && (
              <span className="preview-more">...</span>
            )}
          </div>
          <p className="text-muted small">
            * В шапке отображаются первые 5 видимых категорий. Остальные доступны в выпадающем меню "Еще"
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryOrder;