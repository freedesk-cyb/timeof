// Smooth reveal on scroll
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Apply reveal to sections and products (excluding hero elements which have their own logic now)
    const revealElements = document.querySelectorAll('section:not(#inicio), .product-card');
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(el);
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (window.scrollY > 50) {
            nav.style.padding = '1rem 4rem';
            nav.style.background = 'rgba(10, 10, 10, 0.95)';
        } else {
            nav.style.padding = '1.5rem 4rem';
            nav.style.background = 'rgba(10, 10, 10, 0.8)';
        }
    });

    // Store Item Selection
    const storeItems = document.querySelectorAll('.store-item');
    const googleMap = document.getElementById('google-map');
    
    storeItems.forEach(item => {
        item.addEventListener('click', () => {
            storeItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const newMapSrc = item.getAttribute('data-map');
            googleMap.setAttribute('src', newMapSrc);
            
            console.log(`Cambiando a mapa de: ${item.querySelector('h3').innerText}`);
        });
    });

    // Cotización Form Handler con API (AJAX)
    const cotizacionForm = document.getElementById('quote-form');
    const formStatus = document.getElementById('form-status');

    if (cotizacionForm) {
        cotizacionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = cotizacionForm.querySelector('button');
            const originalText = btn.innerText;
            
            // Reemplaza con tu correo real para activar el servicio
            const API_ENDPOINT = "https://formsubmit.co/ajax/omar-28-01@hotmail.com"; 

            btn.innerText = 'Procesando Envío...';
            btn.disabled = true;
            formStatus.style.display = 'none';

            try {
                const formData = new FormData(cotizacionForm);
                const response = await fetch(API_ENDPOINT, {
                    method: "POST",
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    formStatus.innerText = "¡Éxito! Tu cotización ha sido enviada al correo de la solicitud.";
                    formStatus.style.color = "var(--primary)";
                    formStatus.style.display = 'block';
                    cotizacionForm.reset();
                } else {
                    throw new Error(data.message || "Error al enviar");
                }
            } catch (error) {
                console.error("Error API:", error);
                formStatus.innerText = "Error: No se pudo conectar con el servidor de correos.";
                formStatus.style.color = "#ff4d4d";
                formStatus.style.display = 'block';
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    }

    // Modal Logic
    const modal = document.getElementById('product-modal');
    const openModalBtns = document.querySelectorAll('.open-modal');
    const closeModalBtn = document.querySelector('.close-modal');

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid triggering card events if any
            const card = btn.closest('.product-card');
            
            // Get data
            const title = card.getAttribute('data-title');
            const price = card.getAttribute('data-price');
            const img = card.getAttribute('data-img');
            const features = JSON.parse(card.getAttribute('data-features'));

            // Populate Modal
            document.getElementById('modal-title').innerText = title;
            document.getElementById('modal-price').innerText = price;
            document.getElementById('modal-watch-img').src = img;
            
            const featuresContainer = document.getElementById('modal-features');
            featuresContainer.innerHTML = '';
            features.forEach(feat => {
                const li = document.createElement('li');
                li.innerText = feat;
                featuresContainer.appendChild(li);
            });

            // Update quote btn logic
            const quoteBtn = document.getElementById('btn-modal-quote');
            quoteBtn.onclick = (e) => {
                e.preventDefault();
                closeModal();
                
                // Pre-fill form
                const select = document.getElementById('quote-model-select');
                const quoteImg = document.getElementById('quote-product-img');
                const quoteName = document.getElementById('quote-product-name');
                
                select.value = title;
                quoteImg.src = img;
                quoteImg.style.display = 'inline-block';
                quoteName.innerText = `Modelo seleccionado: ${title}`;
                
                // Smooth scroll to quote section
                document.getElementById('cotizacion').scrollIntoView({ behavior: 'smooth' });
            };

            // Show Modal
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Stop scrolling
        });
    });

    const closeModal = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    };

    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target == modal) closeModal();
    });

    // Hero Slider Logic
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.nav-dot');
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    };

    const nextSlide = () => {
        let index = (currentSlide + 1) % slides.length;
        showSlide(index);
    };

    const startSlider = () => {
        slideInterval = setInterval(nextSlide, 5000);
    };

    const stopSlider = () => {
        clearInterval(slideInterval);
    };

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            showSlide(index);
            stopSlider();
            startSlider();
        });
    });

    startSlider();

    // iNTEC Interactive Zoom Logic
    const zoomArea = document.getElementById('zoom-area');
    const zoomImg = document.getElementById('intec-zoom-img');

    if (zoomArea && zoomImg) {
        let isZoomed = false;

        zoomArea.addEventListener('click', () => {
            isZoomed = !isZoomed;
            zoomArea.classList.toggle('is-zoomed', isZoomed);
            
            if (!isZoomed) {
                zoomImg.style.transform = 'scale(1)';
            }
        });

        zoomArea.addEventListener('mousemove', (e) => {
            if (!isZoomed) return;

            const { width, height, left, top } = zoomArea.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;

            // Shift image based on mouse position relative to center
            const moveX = (x - 0.5) * 100;
            const moveY = (y - 0.5) * 100;

            zoomImg.style.transform = `scale(2.5) translate(${-moveX}px, ${-moveY}px)`;
        });

        zoomArea.addEventListener('mouseleave', () => {
            isZoomed = false;
            zoomArea.classList.remove('is-zoomed');
            zoomImg.style.transform = 'scale(1)';
        });
    }

    // Cinematic Reveal Logic
    const revealOptions = { threshold: 0.2 };
    const cinematicObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, revealOptions);

    // Full-Screen Inspector Logic
    const inspector = document.getElementById('inspector-modal');
    const inspectorImg = document.getElementById('inspector-img');
    const closeInspector = document.querySelector('.close-inspector');
    const inspectorWrapper = document.querySelector('.inspector-zoom-wrapper');

    if (zoomArea && inspector) {
        zoomArea.addEventListener('click', () => {
            inspector.classList.add('is-active');
            document.body.style.overflow = 'hidden';
        });

        closeInspector.addEventListener('click', () => {
            inspector.classList.remove('is-active');
            document.body.style.overflow = 'auto';
        });

        inspectorWrapper.addEventListener('mousemove', (e) => {
            const { width, height, left, top } = inspectorWrapper.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;

            // Pan the zoomed image
            const moveX = (x - 0.5) * 1500; // Large multiplier for high Detail
            const moveY = (y - 0.5) * 1500;

            inspectorImg.style.transform = `translate(${-moveX}px, ${-moveY}px) scale(4)`;
        });
    }

    // Mobile Navbar and Basic dropdown toggles
    console.log('Timeof Luxury Engine Initialized v2.5');
});
