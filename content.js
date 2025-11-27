// ClickON - Content Script
// Разблокирует использование кнопок мыши на всех сайтах

(function() {
  'use strict';

  // Функция для включения всех событий мыши
  function enableMouseEvents() {
    // Удаляем все блокировки событий контекстного меню (правая кнопка)
    document.addEventListener('contextmenu', function(e) {
      e.stopPropagation();
    }, true);

    // Разблокируем выделение текста
    document.addEventListener('selectstart', function(e) {
      e.stopPropagation();
    }, true);

    // Разблокируем копирование
    document.addEventListener('copy', function(e) {
      e.stopPropagation();
    }, true);

    // Разблокируем события мыши (клики, нажатия)
    ['mousedown', 'mouseup', 'click', 'dblclick'].forEach(function(eventType) {
      document.addEventListener(eventType, function(e) {
        e.stopPropagation();
      }, true);
    });

    // Разблокируем drag события
    ['dragstart', 'drag', 'dragend'].forEach(function(eventType) {
      document.addEventListener(eventType, function(e) {
        e.stopPropagation();
      }, true);
    });
  }

  // Удаляем CSS правила, блокирующие выделение
  function enableTextSelection() {
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    style.id = 'clickon-enable-selection';
    
    // Вставляем стиль в начало head или в body
    if (document.head) {
      document.head.appendChild(style);
    } else {
      // Если head еще не существует, ждем
      const observer = new MutationObserver(function(mutations, obs) {
        if (document.head) {
          document.head.appendChild(style);
          obs.disconnect();
        }
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }
  }

  // Удаляем обработчики событий, установленные сайтом
  function removeExistingListeners() {
    // Сохраняем оригинальные методы
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const originalRemoveEventListener = EventTarget.prototype.removeEventListener;

    // Список событий для блокировки блокировки
    const protectedEvents = [
      'contextmenu', 'copy', 'cut', 'paste', 'selectstart',
      'mousedown', 'mouseup', 'click', 'dblclick',
      'dragstart', 'drag', 'dragend'
    ];

    // Перехватываем addEventListener для блокируемых событий
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      // Если это защищенное событие и options содержит preventDefault
      if (protectedEvents.includes(type)) {
        // Оборачиваем listener, чтобы предотвратить preventDefault
        const wrappedListener = function(e) {
          const originalPreventDefault = e.preventDefault;
          e.preventDefault = function() {
            // Не позволяем блокировать наши защищенные события
            console.log(`ClickON: Предотвращена блокировка события ${type}`);
          };
          
          try {
            listener.call(this, e);
          } catch (error) {
            // Игнорируем ошибки от блокирующих скриптов
          }
          
          // Восстанавливаем оригинальный preventDefault
          e.preventDefault = originalPreventDefault;
        };
        
        return originalAddEventListener.call(this, type, wrappedListener, options);
      }
      
      // Для остальных событий работаем как обычно
      return originalAddEventListener.call(this, type, listener, options);
    };
  }

  // Проверяем состояние расширения из storage
  chrome.storage.sync.get(['enabled'], function(result) {
    const isEnabled = result.enabled !== false; // По умолчанию включено
    
    if (isEnabled) {
      // Запускаем все функции разблокировки
      removeExistingListeners();
      enableMouseEvents();
      enableTextSelection();
      
      console.log('ClickON: Кнопки мыши разблокированы на этом сайте');
    }
  });

  // Слушаем сообщения от popup для включения/выключения
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'toggle') {
      if (request.enabled) {
        removeExistingListeners();
        enableMouseEvents();
        enableTextSelection();
        console.log('ClickON: Включено');
      } else {
        console.log('ClickON: Выключено (требуется перезагрузка страницы)');
      }
      sendResponse({success: true});
    }
  });

})();


