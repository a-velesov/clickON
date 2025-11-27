// ClickON - Popup Script

document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('toggleExtension');
  const statusText = document.getElementById('statusText');

  // Загружаем текущее состояние из storage
  chrome.storage.sync.get(['enabled'], function(result) {
    const isEnabled = result.enabled !== false; // По умолчанию включено
    toggle.checked = isEnabled;
    updateStatus(isEnabled);
  });

  // Обработчик переключателя
  toggle.addEventListener('change', function() {
    const isEnabled = toggle.checked;
    
    // Сохраняем состояние в storage
    chrome.storage.sync.set({ enabled: isEnabled }, function() {
      updateStatus(isEnabled);
      
      // Отправляем сообщение текущей вкладке
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'toggle',
            enabled: isEnabled
          }, function(response) {
            if (chrome.runtime.lastError) {
              // Ошибка - возможно, страница не поддерживает content scripts
              console.log('Перезагрузите страницу для применения изменений');
            }
          });
        }
      });
    });
  });

  function updateStatus(isEnabled) {
    if (isEnabled) {
      statusText.textContent = 'Включено';
      statusText.style.color = '#28a745';
    } else {
      statusText.textContent = 'Выключено';
      statusText.style.color = '#dc3545';
    }
  }
});


