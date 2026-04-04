// ─── Types ───

export interface SocialLink {
	icon: 'github' | 'linkedin' | 'email';
	href: string;
	label: string;
}

export interface TimelineEntry {
	id: string;
	type: 'work' | 'education' | 'certification' | 'course';
	date: string;
	sortDate: number;
	title: string;
	org: string;
	orgHref?: string;
	featured?: boolean;
	summary: string;
	details?: string[];
	grade?: string;
	certificationId?: string;
	courseId?: string;
	badge?: { src: string; alt: string };
}

export interface Project {
	year: string;
	name: string;
	summary: string;
	stack: string[];
	preview?: { src: string; alt: string };
	demo?: string;
	github?: string;
}

export interface TechStackItem {
	id:
		| 'go'
		| 'git'
		| 'bash'
		| 'github'
		| 'docker'
		| 'kubernetes'
		| 'aws'
		| 'azure';
	label: string;
}

// ─── Meta ───

export const meta = {
	lang: 'en',
	title: 'Marco Sèvegrand',
	description:
		'Software engineer designing calm, reliable digital products with strong systems foundations.'
};

export const sectionVisibility = {
	hero: true,
	techStack: true,
	projects: false,
	timeline: true,
	githubActivity: true
};

// ─── Hero ───

export const hero = {
	role: 'Software Engineer',
	name: 'Marco Sèvegrand',
	location: 'Braga, Portugal',
	timezone: 'Europe/Lisbon',
	cvHref: '/cv.pdf',
	socials: [
		{ icon: 'github', href: 'https://github.com/marcosevegrand', label: 'GitHub' },
		{ icon: 'linkedin', href: 'https://linkedin.com/in/marcosevegrand', label: 'LinkedIn' },
		{ icon: 'email', href: 'mailto:contact@marcosev.com', label: 'Email' }
	] satisfies SocialLink[]
};

// ─── Tech Stack ───

export const techStack: TechStackItem[] = [
	{ id: 'go', label: 'Go' },
	{ id: 'git', label: 'Git' },
	{ id: 'bash', label: 'Bash' },
	{ id: 'github', label: 'GitHub' },
	{ id: 'docker', label: 'Docker' },
	{ id: 'kubernetes', label: 'Kubernetes' },
	{ id: 'aws', label: 'AWS' },
	{ id: 'azure', label: 'Azure' }
];

// ─── Projects ───

export const projects: Project[] = [
	{
		year: '2026',
		name: 'Athletros',
		summary:
			'A fitness tracking progressive web app with offline-first data sync, workout programming, and analytics dashboards built for a personal-training studio.',
		stack: ['SvelteKit', 'Postgres', 'PWA', 'Chart.js'],
		preview: { src: '/projects/athletros.webp', alt: 'Athletros project preview' },
		demo: 'https://athletros.com'
	}
];

// ─── Timeline ───

export const timeline: TimelineEntry[] = [
	{
		id: 'idryl-full-stack-dev',
		type: 'work' as const,
		date: 'Mar 2026 — Present',
		sortDate: 202603,
		title: 'Full-Stack Developer',
		org: 'IDRYL Technologies (partnership)',
		orgHref: 'https://www.idryl.com/',
		featured: false,
		summary:
			'Building a healthcare PWA with production-ready backend and data flows.',
		details: [
			'Working as a self-employed developer on-site with the IDRYL Technologies team.',
			'Designing and developing a healthcare PWA with Next.js and Postgres.'
		]
	},
	{
		id: 'biobrassica-store-web-dev',
		type: 'work' as const,
		date: 'Feb 2026 — Present',
		sortDate: 202602,
		title: 'Store Associate & Web Developer',
		org: 'Biobrassica',
		orgHref: 'https://www.biobrassica.pt/',
		featured: true,
		summary:
			'Balancing daily operations with ownership of the company web presence and communication.',
		details: [
			'Assisting in-store operations and providing daily customer support in a unique retail environment.',
			'Acting as the solo developer for the company website, delivering and maintaining the web presence independently.',
			"Managing and improving Biobrassica's social media presence with consistent content and brand communication."
		]
	},
	{
		id: 'math-physics-tutor',
		type: 'work' as const,
		date: 'Sept 2025 — Present',
		sortDate: 202509,
		title: 'Math & Physics Tutor',
		org: 'Self-employed',
		featured: true,
		summary:
			'Helping students build stronger study systems and more confidence around technical subjects.',
		details: [
			'Providing one-on-one tutoring in mathematics and physics for high-school students.',
			'Creating tailored study approaches to help students build confidence, stay consistent, and prepare for exams.'
		]
	},


	{
		id: 'msc-cybersecurity',
		type: 'education' as const,
		date: '2026 — 2028',
		sortDate: 202609,
		title: 'M.Sc. Cybersecurity',
		org: 'University of Minho',
		orgHref: 'https://www.uminho.pt/EN/',
		featured: true,
		summary: 'Graduate work centered on secure systems, analysis, and defensive design.',
		details: ['Threat analysis.', 'Cryptography.', 'Secure systems design.'],
		grade: 'TBD'
	},
	{
		id: 'bsc-software-engineering',
		type: 'education' as const,
		date: 'Sept 2023 — Jun 2026',
		sortDate: 202309,
		title: 'B.Sc. Software Engineering',
		org: 'University of Minho',
		orgHref: 'https://www.uminho.pt/EN/',
		featured: true,
		summary:
			'Strong foundation across software architecture, core computer science, and delivery discipline.',
		details: [
			'Algorithms and data structures.',
			'Computer networks.',
			'Database systems.'
		],
		grade: '16'
	},


	{
		id: 'aws-solutions-architect-associate',
		type: 'certification' as const,
		date: 'Expected: June 2026',
		sortDate: 202606,
		title: 'AWS Solutions Architect Associate',
		org: 'Amazon Web Services',
		featured: false,
		summary: '',
		details: [],
		certificationId: 'AWS-SAA',
		badge: {
			src: '/badges/AWS Solutions Architect Associate.webp',
			alt: 'AWS Solutions Architect Associate Badge'
		}
	},
	{
		id: 'react-complete-guide',
		type: 'course' as const,
		date: 'Jan 2025',
		sortDate: 202501,
		title: 'React - The Complete Guide 2025',
		org: 'Udemy',
		orgHref: 'https://www.udemy.com/',
		featured: false,
		summary:
			'Comprehensive training on modern React fundamentals, component architecture, hooks, and state management.',
		details: [
			'Built production-style components with reusable patterns and clear state boundaries.',
			'Covered hooks, side effects, forms, routing, and data flow in modern React applications.',
			'Focused on writing maintainable UI code rather than just finishing toy examples.'
		],
		courseId: 'UDEMY-REACT-2025'
	},
	{
		id: 'english-c1-advanced',
		type: 'certification' as const,
		date: 'May 2023',
		sortDate: 202305,
		title: 'English C1 Advanced',
		org: 'Cambridge Assessment English',
		featured: true,
		summary: '',
		details: [],
		certificationId: 'CAMBRIDGE-C1',
		badge: {
			src: '/badges/English C1 Advanced.png',
			alt: 'English C1 Advanced Badge'
		}
	}
].sort((a, b) => b.sortDate - a.sortDate);
