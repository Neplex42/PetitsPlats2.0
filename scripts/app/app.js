console.log('Coucou')

document.querySelectorAll('.dropdown-options_item').forEach((item) => {
  item.addEventListener('click', () => {
    item.classList.toggle('active');
  });
});
