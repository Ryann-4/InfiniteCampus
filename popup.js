const button = document.getElementById('trigger');
    const popup = document.getElementById('popup');
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = popup.classList.contains('shows');
      popup.classList.toggle('shows');
      button.classList.toggle('actives', !isOpen);
    });
    document.addEventListener('click', (e) => {
      if (!popup.contains(e.target) && !button.contains(e.target)) {
        popup.classList.remove('shows');
        button.classList.remove('actives');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        popup.classList.remove('shows');
        button.classList.remove('actives');
      }
    });