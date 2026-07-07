(function(){
  var y = new Date().getFullYear();
  document.getElementById('year').textContent = y;
  document.getElementById('year2').textContent = y;

  var burger = document.getElementById('burger');
  var body = document.body;
  burger.addEventListener('click', function(){
    var open = body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.querySelectorAll('.mobile-menu a').forEach(function(a){
    a.addEventListener('click', function(){
      body.classList.remove('menu-open');
      burger.setAttribute('aria-expanded','false');
    });
  });

  var track = document.getElementById('marqueeTrack');
  track.innerHTML += track.innerHTML;

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, {threshold: 0.12});
    document.querySelectorAll('.rv').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('.rv').forEach(function(el){ el.classList.add('in'); });
  }

  document.querySelectorAll('.nav-links a').forEach(function(a){
    a.addEventListener('click', function(){
      document.querySelectorAll('.nav-links a').forEach(function(x){ x.classList.remove('active'); });
      a.classList.add('active');
    });
  });
})();
