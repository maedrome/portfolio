import { Component, HostListener, signal, AfterViewInit, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  github?: string;
  demo?: string;
}

interface Experience {
  company: string;
  role: string;
  period: string;
  description: string[];
  tags: string[];
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  icon: string;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, AfterViewInit{
  isMenuOpen = false;
  activeSection = '';
  scrolled = false;
  isSubmitting = false;
  isProgrammaticScroll=false;
  targetSection: string | null = null;
  animatedSections = signal<Set<string>>(new Set());
  firstRun = true;
  experienceAnimate = signal(false);
  selectedExperience = signal(0);
  expChanged = effect(() => {
    const exp = this.selectedExperience();
    if (this.firstRun) {
        this.firstRun = false;
      return;
    }
    // Cada cambio dispara animación
    this.experienceAnimate.set(false);

    // microtask para permitir reflow
    queueMicrotask(() => {
      this.experienceAnimate.set(true);
    });
  });
  toasts: Toast[] = [];
  private toastIdCounter = 0;
  private terminalObserver!: IntersectionObserver;
  private terminalAnimationStarted = false;

  sections = ['About', 'Experience', 'Projects', 'Skills', 'Contact']
  
  terminalCommands: { text: string; color: string }[] = [
  { text: '$ ng build --configuration:production', color: '#8B8B8B' },
  { text: '✔ Signals enabled', color: '#22C55E' },
  { text: '✔ Zoneless change detection', color: '#22C55E' },
  { text: '✔ Lazy routes optimized', color: '#22C55E' },
  { text: 'Build complete in 0.9s', color: '#A78BFA' },
  { text: '$', color: '#8B8B8B' }
];
  displayedCommands: { text: string; color: string; isComplete: boolean }[] = [];
  currentCommandIndex = 0;
  currentCharIndex = 0;
  

  contactForm: FormGroup;

  mySkills = {
    languages: ['TypeScript', 'JavaScript', 'HTML', 'CSS', 'Angular', 'NestJS', 'Node.js','Python'],
    frameworks: ['Bootstrap', 'Tailwind CSS', 'Angular Material', 'Primeflex', 'PrimeNG'],
    tools: ['Git', 'GitHub', 'VS Code', 'Docker', 'Postman', 'Windows', 'Ubuntu Linux', 'Raspberry Pi OS'],
    database: ['MongoDB', 'PostgreSQL', 'MySQL']
  };

  technologies = [
    'Angular', 'NestJS', 'Tailwind CSS', 'Docker', 
    'Primeflex', 'PostgreSQL', 'Daisy UI', 'RxJS'
  ];

  experiences: Experience[] = [
    {
      company: 'FleetFlex',
      role: 'Assistant Frontend Developer',
      period: 'May - September 2022',
      description: [
        'Maintained a Flutter-based mobile application.',
        'Developed and improved features in a web application built with Angular framework.',
        'Collaborated with the team using productivity and issue-tracking tools.'
      ],
      tags: ['Angular', 'Flutter SDK', 'Angular Material', 'Asana', 'Docker', 'MongoDB', 'PrimeNG']
    },
    {
      company: 'M&M Solutions',
      role: 'Frontend Developer',
      period: '2024',
      description: [
        'Designed and developed a landing page website.',
        'Implemented SEO Optimization.',
        'Responsive across all devices.'
      ],
      tags: ['Node.js', 'Javascript', 'SwiperJS', 'Daisy UI', 'Tailwind CSS']
    }
  ];

  myProjects: Project[] = [
    {
      title: 'Responsive Service Landing',
      description: 'Fully responsive and SEO-optimized landing page for security and HVAC services with direct contact channels via email and WhatsApp.',
      image: 'assets/images/mmsolutions2.JPG',
      tags: ['Javascript', 'SwiperJS', 'Daisy UI', 'Tailwind CSS', 'EmailJS', 'SEO Optimization'],
      github: 'https://github.com/maedrome/MGMLanding',
      demo: 'https://mmsolutionsg.com/'
    },
    {
      title: 'Sukia Store E-Commerce',
      description: 'Full-stack e-commerce application with product management, authentication, shopping cart, and PayPhone payment integration.',
      image: 'assets/images/sukiastore.JPG',
      tags: ['Angular 19', 'NestJS', 'Tailwind CSS', 'DaisyUI','PostgreSQL', 'TypeORM'],
      github: 'https://github.com/maedrome/eclat-shop-backend',
      demo: 'https://sukiastore.com'
    }
    // {
    //   title: 'Weather Dashboard',
    //   description: 'Dashboard meteorológico con pronósticos detallados, gráficos interactivos y geolocalización automática.',
    //   image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop',
    //   tags: ['Angular', 'Chart.js', 'OpenWeather API'],
    //   github: '#',
    //   demo: '#'
    // }
  ];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });

    emailjs.init('pIeWVJYHiuaHc3N8S');
  }

  private observer!: IntersectionObserver;

  ngAfterViewInit() {
    setTimeout(() => {
      document.body.style.animation = 'fadeIn 0.8s ease-out forwards';
    }, 500);
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (!this.animatedSections().has(id)) {
              this.animatedSections.update(set => new Set(set).add(id));
              console.log(id)
            }
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    const sections = ['home', 'about', 'experience', 'projects', 'skills', 'contact'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) this.observer.observe(el);
    });

    this.terminalObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.terminalAnimationStarted) {
            this.terminalAnimationStarted = true;
            this.startTerminalAnimation();
            this.terminalObserver.disconnect(); // Ya no necesitamos observar más
          }
        });
      },
      {
        threshold: 0.3 // Inicia cuando el 30% del terminal esté visible
      }
    );

    const terminalElement = document.querySelector('#terminal-animation');
    if (terminalElement) {
      this.terminalObserver.observe(terminalElement);
    }
  }
  
  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.terminalObserver) {
      this.terminalObserver.disconnect();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 50;
    this.updateActiveSection();
  }

  updateActiveSection() {
    const sections = ['home', 'about', 'experience', 'projects', 'skills', 'contact'];
    const scrollPosition = window.scrollY + 100;

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const offsetTop = element.offsetTop;
        const offsetHeight = element.offsetHeight;
        
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          if (this.isProgrammaticScroll) {
            if (section === this.targetSection) {
              // llegué al destino
              this.isProgrammaticScroll = false;
              this.targetSection = null;
            } else {
              // aún no llego → ignora
              return;
            }
          }
          this.activeSection = section;
          break;
        }
      }
    }
  }

  scrollToSection(sectionId: string) {
    this.targetSection = sectionId;
    this.activeSection=sectionId;
    this.isProgrammaticScroll=true;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView(
        {
          behavior: 'smooth',
          block: 'start'
        }
      );
      this.isMenuOpen = false;
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  selectExperience(index: number) {
    this.selectedExperience.set(index);
  }
  startTerminalAnimation() {
    const typeNextChar = () => {
      if (this.currentCommandIndex >= this.terminalCommands.length) {
        return;
      }

      const currentCommand = this.terminalCommands[this.currentCommandIndex];
      
      if (this.currentCharIndex < currentCommand.text.length) {
        // Actualizar el comando actual mientras se escribe
        if (!this.displayedCommands[this.currentCommandIndex]) {
          this.displayedCommands[this.currentCommandIndex] = {
            text: '',
            color: currentCommand.color,
            isComplete: false
          };
        }
        
        this.displayedCommands[this.currentCommandIndex].text = 
          currentCommand.text.substring(0, this.currentCharIndex + 1);
        this.currentCharIndex++;
        setTimeout(typeNextChar, 30);
      } else {
        // Marcar como completo (sin cursor)
        this.displayedCommands[this.currentCommandIndex].isComplete = true;
        
        this.currentCommandIndex++;
        this.currentCharIndex = 0;
        setTimeout(typeNextChar, 500);
      }
    };

    typeNextChar();
  }

  getRowDelay(index: number, cols = 2, base = 180) {
    const row = Math.floor(index / cols);
    return `${row * base}ms`;
  }

  async submitContact() {
  if (this.contactForm.valid) {
    const formData = this.contactForm.value;
    
    // Declarar variables fuera del try
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalText = submitButton?.innerHTML || '';
    
    try {
      // Mostrar loading
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
      }

      // Enviar email usando EmailJS
      const response = await emailjs.send(
        'service_x9bsnot',      // Reemplaza con tu Service ID
        'template_ckw9vmo',     // Reemplaza con tu Template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        }
      );

      console.log('Email sent successfully', response);
      this.showToast('Message sent successfully! I’ll get back to you soon.', 'success');
      this.contactForm.reset();

    } catch (error) {
      console.error('Error sending email:', error);
      this.showToast('There was an error sending the message. Please try again.', 'error');
    } finally {
      // Restaurar botón
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
      }
    }
  } else {
    Object.keys(this.contactForm.controls).forEach(key => {
      this.contactForm.get(key)?.markAsTouched();
    });
  }
}

  get name() {
    return this.contactForm.get('name');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get message() {
    return this.contactForm.get('message');
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const icons = {
      success: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>`,
      error: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>`,
      info: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>`
    };

    const toast: Toast = {
      id: this.toastIdCounter++,
      message,
      type,
      icon: icons[type]
    };

    this.toasts.push(toast);

    // Auto-remove después de 5 segundos
    setTimeout(() => {
      this.removeToast(toast.id);
    }, 5000);
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
}