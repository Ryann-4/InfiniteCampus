document.addEventListener('DOMContentLoaded', () => {
  const footerHTML = `
    <footer id="site-footer" style="bottom:-4; text-align:left">
      <p>Totally Made By Noah White And Not A Different Person.</p>
    </footer>
    <footer id="text-only-footer" style="background-color:transparent; text-align:right; bottom:-4">
      <p>Pissing Off Your Teachers Since 2024</p>
    </footer>
  `;
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = footerHTML;
  Array.from(tempDiv.children).reverse().forEach(child => {
    document.body.insertBefore(child, document.body.firstChild);
  });
});
