// ─────────────────────────────────────────────────────────────────────────────
// constants.js  —  All dropdown/chip data
// ─────────────────────────────────────────────────────────────────────────────

export const ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Data Scientist', 'Machine Learning Engineer', 'AI Engineer', 'DevOps Engineer',
  'Platform Engineer', 'Cloud Architect', 'Product Manager', 'UI/UX Designer',
  'Mobile Developer', 'Data Engineer', 'Security Engineer', 'QA / SDET',
];

export const EXP_LEVELS = [
  { id: 'intern', label: 'Internship',   years: '0 yrs',   color: 'var(--p)' },
  { id: 'entry',  label: 'Entry Level',  years: '0–2 yrs', color: 'var(--b)' },
  { id: 'mid',    label: 'Mid Level',    years: '2–5 yrs', color: 'var(--y)' },
  { id: 'senior', label: 'Senior',       years: '5–8 yrs', color: 'var(--r)' },
  { id: 'staff',  label: 'Staff / Lead', years: '8+ yrs',  color: 'var(--g)' },
];

export const COMPANY_TYPES = [
  { id: 'faang',   label: 'FAANG / Big Tech',   emoji: '🏢' },
  { id: 'startup', label: 'Startup',             emoji: '🚀' },
  { id: 'product', label: 'Product Company',     emoji: '📦' },
  { id: 'service', label: 'Service / IT',        emoji: '🔧' },
  { id: 'unicorn', label: 'Unicorn / Scale-up',  emoji: '🦄' },
];

export const TECH_GROUPS = {
  'Languages':    ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'Go', 'Rust', 'C#', 'Swift', 'Kotlin', 'Ruby', 'PHP', 'Scala'],
  'Frontend':     ['React', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'Tailwind CSS', 'GraphQL', 'Redux', 'Webpack'],
  'Backend':      ['Node.js', 'FastAPI', 'Django', 'Express', 'Spring Boot', 'Rails', 'Flask', 'gRPC', 'REST APIs'],
  'Databases':    ['SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Cassandra', 'DynamoDB', 'Supabase'],
  'Cloud/DevOps': ['AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'GitHub Actions', 'Jenkins', 'Ansible'],
  'AI / ML':      ['Machine Learning', 'PyTorch', 'TensorFlow', 'LangChain', 'Pandas', 'Scikit-learn', 'MLOps', 'Vector DBs', 'OpenAI API'],
  'Mobile':       ['React Native', 'Flutter', 'iOS (Swift)', 'Android (Kotlin)', 'Expo'],
  'Tools':        ['Git', 'Linux', 'Jira', 'Figma', 'Postman', 'Kafka', 'RabbitMQ', 'Nginx'],
};

export const SAMPLE_RESUME = `Alex Johnson
alex.johnson@email.com | New York, NY | github.com/alexj | linkedin.com/in/alexj

SUMMARY
Software engineer with 4 years of experience building backend services and REST APIs.

EXPERIENCE

Software Engineer — DataFlow Inc. (2022–Present)
• Worked on backend systems using Python and Django
• Helped with database queries and basic optimization tasks
• Participated in code reviews
• Used AWS EC2 and S3 for deployments

Junior Software Engineer — WebAgency Co. (2020–2022)
• Built REST APIs for client projects using Django and Flask
• Worked with React for frontend features
• Managed PostgreSQL and MySQL databases
• Expert in microservices and distributed systems architecture

EDUCATION
B.S. Computer Science — State University (2020) · GPA: 3.6

SKILLS
Python, Django, Flask, JavaScript, React, SQL, PostgreSQL, AWS, Docker, Git, REST APIs

PROJECTS
• Personal blog platform — Django + React, deployed on AWS EC2
• Task management API — Node.js with PostgreSQL, 200+ GitHub stars`;
