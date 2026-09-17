/* Paginas de proyecto: aparicion al hacer scroll, videos por viewport y lightbox. */
(function () {
  var piezas = [].slice.call(document.querySelectorAll('.pieza'));

  document.querySelectorAll('.pieza img').forEach(function (img) {
    if (img.complete && img.naturalWidth) img.classList.add('ok');
    else img.addEventListener('load', function () { img.classList.add('ok'); }, { once: true });
  });

  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -6% 0px' }) : null;
  document.querySelectorAll('.rv').forEach(function (el) { io ? io.observe(el) : el.classList.add('in'); });

  var vio = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) { v.preload = 'auto'; v.play().catch(function () {}); } else { v.pause(); }
    });
  }, { threshold: .15 }) : null;
  document.querySelectorAll('.pieza video').forEach(function (v) { vio && vio.observe(v); });

  /* Lightbox */
  var lb = document.getElementById('lb');
  if (!lb) return;
  var fig = lb.querySelector('.lb-fig');
  var cuenta = lb.querySelector('.lb-n');
  var i = 0;

  function abrir(n) {
    i = (n + piezas.length) % piezas.length;
    var p = piezas[i];
    var v = p.querySelector('video');
    var src = v ? v.getAttribute('src') : p.querySelector('img').getAttribute('src');
    var larga = p.classList.contains('larga');
    fig.classList.toggle('larga', larga);
    fig.innerHTML = v
      ? '<video src="' + src + '" controls autoplay loop playsinline></video>'
      : '<img src="' + src + '" alt="' + (p.querySelector('img').alt || '') + '">';
    if (larga) fig.scrollTop = 0;
    cuenta.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(piezas.length).padStart(2, '0');
    lb.classList.add('on');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function cerrar() {
    lb.classList.remove('on');
    lb.setAttribute('aria-hidden', 'true');
    fig.innerHTML = '';
    document.body.style.overflow = '';
  }

  piezas.forEach(function (p, n) {
    var b = p.querySelector('button');
    if (b) b.addEventListener('click', function () { abrir(n); });
  });
  lb.querySelector('.lb-cerrar').addEventListener('click', cerrar);
  lb.querySelector('.lb-ant').addEventListener('click', function () { abrir(i - 1); });
  lb.querySelector('.lb-sig').addEventListener('click', function () { abrir(i + 1); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('on')) return;
    if (e.key === 'Escape') cerrar();
    if (e.key === 'ArrowLeft') abrir(i - 1);
    if (e.key === 'ArrowRight') abrir(i + 1);
  });
})();
