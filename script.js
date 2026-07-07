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

  var gallery = [
    'images/bike-travel.jpeg',
    'images/image1.jpeg',
    'images/image2.jpeg',
    'images/image3.jpeg',
    'images/image4.jpeg',
    'images/image5.jpeg',
    'images/image6.jpeg',
    'images/image7.jpeg',
    'images/image8.jpeg'
  ];
  var galleryImg = document.getElementById('galleryImg');
  var galleryCap = document.getElementById('galleryCap');
  var galleryOpen = document.getElementById('galleryOpen');
  var current = 0;
  var switching = false;

  galleryOpen.addEventListener('click', function(){
    if (switching) return;
    switching = true;
    galleryImg.classList.add('fade');
    setTimeout(function(){
      current = (current + 1) % gallery.length;
      galleryImg.src = gallery[current];
      galleryCap.textContent = '✳ On the road — ' + (current + 1) + '/' + gallery.length;
      galleryImg.classList.remove('fade');
      switching = false;
    }, 250);
  });
})();
