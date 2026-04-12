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
	keywords: string[];
	details?: string[];
	grade?: string;
	certificationId?: string;
	courseId?: string;
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
	cvHref: '/cv/cv.pdf',
	socials: [
		{ icon: 'github', href: 'https://github.com/marcosevegrand', label: 'GitHub' },
		{ icon: 'linkedin', href: 'https://linkedin.com/in/marcosevegrand', label: 'LinkedIn' },
		{ icon: 'email', href: 'mailto:contact@marcosev.com', label: 'Email' }
	] satisfies SocialLink[]
};

// ─── Tech Stack ───

export const techStack: TechStackItem[] = [
	{ id: 'go', label: 'Go' },
	{ id: 'bash', label: 'Bash' },
	{ id: 'git', label: 'Git' },
	{ id: 'github', label: 'GitHub' },
	{ id: 'docker', label: 'Docker' },
	{ id: 'azure', label: 'Azure' }
];

// ─── Projects ───

export const projects: Project[] = [
	{
		year: '2026',
		name: 'App Name',
		summary:
			'...',
		stack: ['SvelteKit', 'Postgres', 'PWA', 'Chart.js'],
		preview: { src: '/projects/appPicture.webp', alt: 'App project preview' },
		demo: 'https://example.com'
	}
];

// ─── Timeline ───

export const timeline: TimelineEntry[] = [
	{
		id: 'biobrassica-store-web-dev',
		type: 'work' as const,
		date: 'Feb 2026 — Present',
		sortDate: 202602,
		title: 'Store Associate & Web Developer',
		org: 'Biobrassica',
		orgHref: 'https://www.biobrassica.pt/',
		featured: true,
		keywords: ['Retail Operations', 'Customer Support', 'Full-Stack Development'],
		details: [
			'Assisting in-store operations and providing daily customer support in a unique retail environment.',
			'Acting as the solo developer for the company website, delivering and maintaining the web presence independently.'
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
		keywords: ['1:1 Tutoring', 'Mathematics', 'Physics', 'Exam Preparation'],
		details: [
			'Providing one-on-one tutoring in mathematics and physics for high-school students.',
			'Creating tailored study approaches to help students build confidence, stay consistent, and prepare for exams.'
		]
	},


	// {
	// 	id: 'msc-cybersecurity',
	// 	type: 'education' as const,
	// 	date: 'NOT YET STARTED',
	// 	sortDate: 202609,
	// 	title: 'M.Sc. Cybersecurity',
	// 	org: 'University of Minho',
	// 	orgHref: 'https://www.uminho.pt/EN/',
	// 	featured: true,
	// 	keywords: ['Cybersecurity hands-on', 'Network security', 'Cryptography', 'Incident management'],
	// 	details: [
	// 		'Hands-on labs in network security and traffic analysis to simulate real cyberattack scenarios.',
	// 		'Advanced courses in cryptography, incident management, and intrusion tolerance focusing on software security.',
	// 		'Specialized cybersecurity seminars, digital forensics, and IoT security.'
	// 	],
	// },
	{
		id: 'bsc-software-engineering',
		type: 'education' as const,
		date: 'Sept 2023 — Jun 2026',
		sortDate: 202309,
		title: 'B.Sc. Software Engineering',
		org: 'University of Minho',
		orgHref: 'https://www.uminho.pt/EN/',
		featured: true,
		keywords: ['Software Architecture', 'Networks', 'Algorithms', 'Distributed Systems'],
		details: [
			'Algorithms and data structures.',
			'Computer networks.',
			'Database systems.'
		],
		grade: '16'
	},
	{
		id: 'secondary-education',
		type: 'education' as const,
		date: 'Sept 2019 — Jun 2023',
		sortDate: 201909,
		title: 'Secondary Education',
		org: 'Escola Secundária Fernão de Magalhães',
		orgHref: 'https://aefmagalhaes.pt/',
		featured: false,
		keywords: ['Science & Technology', 'Mathematics', 'Physics', 'Biology'],
		grade: '19.6'
	},


	{
		id: 'learning-kubernetes-linkedin',
		type: 'course' as const,
		date: 'Feb 2026',
		sortDate: 202602,
		title: 'Learning Kubernetes',
		org: 'LinkedIn',
		orgHref: 'https://www.linkedin.com/learning/',
		featured: false,
		keywords: ['Kubernetes', 'Container Orchestration', 'Pods & Deployments', 'Cluster Networking'],
		details: [
			'Covered the core Kubernetes model, including pods, deployments, services, and cluster architecture.',
			'Learned how containerized applications are scheduled, exposed, and managed in a Kubernetes environment.',
			'Focused on practical orchestration concepts rather than basic container usage alone.'
		],
		courseId: '6c8b28d6f4f8050b76bc371cd835ab70d36bb18bbc52af879c9ab202b25ff4d4'
	},
	{
		id: 'english-c1-advanced',
		type: 'certification' as const,
		date: 'May 2023',
		sortDate: 202305,
		title: 'English C1 Advanced',
		org: 'Cambridge Assessment English',
		featured: true,
		keywords: ['C1 English', 'Fluent', 'Versatile'],
		details: [],
		certificationId: 'C1827928'
	}
].sort((a, b) => b.sortDate - a.sortDate);
