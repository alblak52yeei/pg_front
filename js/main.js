document.addEventListener('DOMContentLoaded', () => {
  // Переключение вкладок (МЕТЕОБЮЛЛЕТЕНЬ / ЖУРНАЛ ИЗМЕРЕНИЙ)
  const tabButtons = document.querySelectorAll('.meteo__nav-btn');
  const tabContents = document.querySelectorAll('.meteo__tab');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Сбрасываем класс active на всех кнопках
      tabButtons.forEach(b => b.classList.remove('meteo__nav-btn--active'));
      // Назначаем active на текущую
      btn.classList.add('meteo__nav-btn--active');

      const targetTab = btn.getAttribute('data-tab');

      // Показываем нужный блок, скрываем остальные
      tabContents.forEach(tc => {
        if (tc.id === targetTab) {
          tc.classList.remove('meteo__tab--hidden');
        } else {
          tc.classList.add('meteo__tab--hidden');
        }
      });
    });
  });

  // Переключение режимов (ДМК / ВР)
  const modeButtons = document.querySelectorAll('.mode-selector__btn');
  const windSpeedGroup = document.getElementById('windSpeedGroup');
  const bulletDriftGroup = document.getElementById('bulletDriftGroup');
  let currentMode = 'dmk'; // По умолчанию ДМК

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => b.classList.remove('mode-selector__btn--active'));
      btn.classList.add('mode-selector__btn--active');
      currentMode = btn.getAttribute('data-mode');

      if (currentMode === 'dmk') {
        // Отображаем "Скорость ветра"
        windSpeedGroup.style.display = 'flex';
        // Скрываем "Дальность сноса пуль"
        bulletDriftGroup.style.display = 'none';
      } else {
        // Скрываем "Скорость ветра"
        windSpeedGroup.style.display = 'none';
        // Отображаем "Дальность сноса пуль"
        bulletDriftGroup.style.display = 'flex';
      }

      checkFormValidity();
    });
  });

  // Валидация формы
  const inputs = document.querySelectorAll('.input-form__field');
  const createBtn = document.getElementById('createMeteo11');

  inputs.forEach(input => {
    input.addEventListener('input', checkFormValidity);
  });

  function checkFormValidity() {
    let allValid = true;

    inputs.forEach(input => {
      // Проверяем только те инпуты, которые видимы (не скрыты через display: none)
      if (input.parentElement.style.display !== 'none') {
        if (input.value.trim() === '') {
          allValid = false;
        }
        
        const value = parseFloat(input.value);
        const min = parseFloat(input.min);
        const max = parseFloat(input.max);
        
        if (input.hasAttribute('min') && value < min) {
          allValid = false;
        }
        if (input.hasAttribute('max') && value > max) {
          allValid = false;
        }
      }
    });

    createBtn.disabled = !allValid;
  }

  // Заполнение таблицы "МЕТЕО-11 ПРИБЛИЖЕННЫЙ" и отображение кнопки "Принять как Действ."
  const meteoTableBodies = document.querySelectorAll('.meteo-table__body');
  const acceptBtn = document.getElementById('acceptBtn');

  createBtn.addEventListener('click', () => {
    // Очищаем и заполняем обе таблицы
    meteoTableBodies.forEach(tableBody => {
      tableBody.innerHTML = ''; // Очищаем предыдущие результаты
  
      for (let i = 0; i < 8; i++) {
        const row = document.createElement('tr');
        row.className = 'meteo-table__row';
        
        const cells = ['diCell', 'dtCell', 'dWCell', 'wCell'].map(() => {
          const cell = document.createElement('td');
          cell.className = 'meteo-table__cell';
          return cell;
        });
  
        cells[0].textContent = i * 2;
        cells[1].textContent = `0${i} ч`;
        cells[2].textContent = (Math.random() * 10).toFixed(2);
        cells[3].textContent = (Math.random() * 5).toFixed(2);
        
        cells.forEach(cell => row.appendChild(cell));
        tableBody.appendChild(row);
      }
    });

    // Показываем кнопку "Принять как Действ."
    acceptBtn.classList.remove('meteo-btn--hidden');
  });

  acceptBtn.addEventListener('click', () => {
    // Добавляем запись в журнал измерений
    const logBody = document.querySelector('.log__body');
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const row = document.createElement('tr');
    row.className = 'log__row';
    
    const data = [
      dateStr,
      document.getElementById('height').value,
      document.getElementById('temperature').value,
      document.getElementById('pressure').value,
      document.getElementById('windDirection').value,
      currentMode === 'dmk' ? 
        document.getElementById('windSpeed').value : 
        document.getElementById('bulletDrift').value
    ];
    
    data.forEach(text => {
      const cell = document.createElement('td');
      cell.className = 'log__cell';
      cell.textContent = text;
      row.appendChild(cell);
    });
    
    logBody.appendChild(row);
    
    alert('Принят как действующий метеобюллетень!');
  });
});