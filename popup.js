const button = document.getElementById('trigger');
    const popup = document.getElementById('popup');

    // Toggle popup on button click
    button.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent triggering outside click
      const isOpen = popup.classList.contains('shows');
      popup.classList.toggle('shows');
      button.classList.toggle('actives', !isOpen);
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!popup.contains(e.target) && !button.contains(e.target)) {
        popup.classList.remove('shows');
        button.classList.remove('actives');
      }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        popup.classList.remove('shows');
        button.classList.remove('actives');
      }
    });