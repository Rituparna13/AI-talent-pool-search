import { randomUUID } from 'crypto'

// Use native fetch (Node 18+)
const fetch = globalThis.fetch

// Sample resume templates with varied experience levels, skills, and locations
const FAKE_RESUMES = [
  {
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    phone: '+1-555-0101',
    linkedin: 'https://www.linkedin.com/in/sarah-chen',
    github: 'https://www.github.com/sarahchen',
    text: `SARAH CHEN
Sarah.chen@email.com | (555) 0101 | San Francisco, CA
https://www.linkedin.com/in/sarah-chen | https://www.github.com/sarahchen

SENIOR FULL-STACK ENGINEER
8 years of experience building scalable web applications

EXPERIENCE
Senior Software Engineer | TechCorp | 2021-Present (3 years)
- Led development of microservices architecture serving 10M+ users
- Mentored team of 5 junior engineers
- Reduced API latency by 40% through optimization

Full-Stack Engineer | StartupXYZ | 2018-2021 (3 years)
- Built React and Node.js web applications
- Implemented CI/CD pipelines with Docker and Kubernetes
- Achieved 99.9% uptime for production systems

Junior Developer | WebAgency | 2016-2018 (2 years)
- Developed responsive websites using HTML, CSS, JavaScript
- Maintained WordPress sites for clients

SKILLS
Languages: JavaScript, TypeScript, Python, SQL
Frontend: React, Vue.js, Tailwind CSS
Backend: Node.js, Express, Django, PostgreSQL
DevOps: Docker, Kubernetes, AWS, CI/CD
Other: Git, REST APIs, GraphQL, Agile methodologies`,
  },
  {
    name: 'Marcus Johnson',
    email: 'marcus.j@email.com',
    phone: '+1-555-0102',
    linkedin: 'https://www.linkedin.com/in/marcus-johnson',
    github: 'https://www.github.com/mjohnson',
    text: `MARCUS JOHNSON
New York, NY | marcus.j@email.com | 555-0102
LinkedIn: https://www.linkedin.com/in/marcus-johnson | GitHub: https://www.github.com/mjohnson

PRODUCT MANAGER
6 years of product management and strategy

CAREER HISTORY
Senior Product Manager | FinTechCo | 2021-Present (2 years)
- Managed product roadmap for mobile banking app with 2M+ users
- Increased user engagement by 35% through feature optimization
- Led cross-functional teams of engineers, designers, and marketers

Product Manager | EdTech Startup | 2018-2021 (3 years)
- Launched online learning platform serving 500K students
- Defined product strategy and conducted user research
- Managed $2M annual budget

Associate Product Manager | Big Tech | 2017-2018 (1 year)
- Analyzed user data and market trends
- Supported senior product managers on feature development

CORE COMPETENCIES
Product Strategy | User Research | Data Analysis | A/B Testing
Roadmap Planning | Stakeholder Management | Agile/Scrum | Analytics`,
  },
  {
    name: 'Jennifer Liu',
    email: 'jen.liu@email.com',
    phone: '(555) 0103',
    linkedin: 'https://www.linkedin.com/in/jennylu',
    github: 'https://www.github.com/jennylu',
    text: `JENNIFER LIU
Denver, CO | jen.liu@email.com | (555) 0103
https://www.linkedin.com/in/jennylu | https://www.github.com/jennylu

UX/UI DESIGNER
5 years of user experience design

PROFESSIONAL EXPERIENCE
Lead Designer | Design Studio | 2020-Present (3 years)
- Led design system redesign for SaaS platform
- Conducted user testing and iterative design improvements
- Managed design team of 3 designers

Product Designer | Mobile App Company | 2019-2020 (1 year)
- Designed user interfaces for iOS and Android apps
- Created wireframes and prototypes using Figma

Junior UX Designer | Web Agency | 2018-2019 (1 year)
- Designed website interfaces for diverse clients
- Conducted user research and accessibility audits

DESIGN SKILLS
Figma | Adobe XD | Prototyping | User Research | Accessibility
Information Architecture | Wireframing | Visual Design | Design Systems`,
  },
  {
    name: 'David Patel',
    email: 'dpatel@email.com',
    phone: '+1-555-0104',
    linkedin: 'https://www.linkedin.com/in/davidpatel',
    text: `DAVID PATEL
Austin, TX | dpatel@email.com | (555) 0104
LinkedIn: https://www.linkedin.com/in/davidpatel

DATA SCIENTIST
7 years of machine learning and data analytics

WORK EXPERIENCE
Senior Data Scientist | AI Company | 2021-Present (2 years)
- Developed ML models for predictive analytics
- Led data science team of 4 researchers
- Improved model accuracy to 94% using ensemble methods

Data Scientist | Analytics Firm | 2018-2021 (3 years)
- Built recommendation systems for e-commerce platforms
- Conducted A/B testing and statistical analysis
- Worked with datasets of 100GB+

Junior Data Analyst | Retail Corp | 2016-2018 (2 years)
- Created dashboards and business intelligence reports
- Analyzed customer behavior patterns

TECHNICAL SKILLS
Python | R | SQL | Machine Learning | TensorFlow | PyTorch
Data Visualization | Tableau | Pandas | Statistics | AWS SageMaker`,
  },
  {
    name: 'Emma Williams',
    email: 'emma.w@email.com',
    phone: '(555) 0105',
    linkedin: 'https://www.linkedin.com/in/emmaw',
    github: 'https://www.github.com/emmaw',
    text: `EMMA WILLIAMS
Boston, MA | emma.w@email.com | (555) 0105
https://www.linkedin.com/in/emmaw | https://www.github.com/emmaw

FRONTEND ENGINEER
4 years of web development

EMPLOYMENT
Frontend Engineer | Fashion E-Commerce | 2021-Present (2 years)
- Built and maintained React component library
- Optimized performance, reducing page load by 50%
- Collaborated with designers and backend engineers

Junior Frontend Developer | Digital Agency | 2019-2021 (2 years)
- Developed responsive websites with React and Vue
- Integrated APIs and implemented state management with Redux
- Participated in code reviews and pair programming

STACK
JavaScript | TypeScript | React | Vue.js | CSS-in-JS
Testing: Jest, React Testing Library | Version Control: Git`,
  },
  {
    name: 'Robert Garcia',
    email: 'robert.garcia@email.com',
    phone: '+1-555-0106',
    linkedin: 'https://www.linkedin.com/in/robertgarcia',
    text: `ROBERT GARCIA
Miami, FL | robert.garcia@email.com | (555) 0106
https://www.linkedin.com/in/robertgarcia

PROJECT MANAGER
10 years of project management

CAREER
Director of Project Management | Construction Tech | 2020-Present (3 years)
- Oversaw portfolio of 15+ concurrent projects worth $50M
- Reduced project delivery time by 25% through process optimization
- Managed teams of 30+ across multiple locations

Senior Project Manager | Enterprise Software | 2017-2020 (3 years)
- Led enterprise software implementations for Fortune 500 companies
- Managed budgets up to $10M per project
- Achieved 98% on-time delivery rate

Project Manager | IT Consulting | 2013-2017 (4 years)
- Managed technology infrastructure projects
- Coordinated with vendors and stakeholders

EXPERTISE
Project Planning | Risk Management | Agile Methodologies
Stakeholder Communication | Budget Management | Team Leadership`,
  },
  {
    name: 'Lisa Anderson',
    email: 'lisa.anderson@email.com',
    phone: '(555) 0107',
    linkedin: 'https://www.linkedin.com/in/lisaanderson',
    text: `LISA ANDERSON
Seattle, WA | lisa.anderson@email.com | (555) 0107
https://www.linkedin.com/in/lisaanderson

BACKEND ENGINEER
6 years of backend development

EXPERIENCE
Backend Engineer | Payment Processing | 2021-Present (2 years)
- Designed and built scalable payment processing systems
- Implemented distributed transaction management
- Improved system reliability to 99.99%

Senior Backend Developer | SaaS Company | 2018-2021 (3 years)
- Built RESTful APIs serving millions of requests daily
- Optimized database queries reducing response time by 60%
- Led microservices migration

Junior Backend Developer | Web Startup | 2017-2018 (1 year)
- Developed backend services using Python and PostgreSQL
- Implemented caching strategies with Redis

SKILLS
Python | Java | Node.js | PostgreSQL | MongoDB | Redis
Docker | Kubernetes | Message Queues | System Design`,
  },
  {
    name: 'James Wilson',
    email: 'james.w@email.com',
    phone: '+1-555-0108',
    linkedin: 'https://www.linkedin.com/in/jameswilson',
    text: `JAMES WILSON
Chicago, IL | james.w@email.com | (555) 0108
https://www.linkedin.com/in/jameswilson

SALES EXECUTIVE
9 years of enterprise sales

BACKGROUND
VP of Sales | Enterprise SaaS | 2021-Present (2 years)
- Built and led sales team growing revenue to $50M
- Closed deals with Fortune 500 companies
- Achieved 150% of sales quota consistently

Senior Account Executive | Software Company | 2017-2021 (4 years)
- Generated $20M+ in annual recurring revenue
- Managed relationships with top-tier accounts
- Won industry sales awards

Sales Representative | Tech Startup | 2014-2017 (3 years)
- Started as junior sales rep, promoted to senior
- Consistently exceeded sales targets

STRENGTHS
Enterprise Sales | Relationship Building | Negotiation
Team Leadership | Territory Management | CRM Systems`,
  },
  {
    name: 'Michelle Brown',
    email: 'michelle.b@email.com',
    phone: '(555) 0109',
    linkedin: 'https://www.linkedin.com/in/michellebrown',
    text: `MICHELLE BROWN
Los Angeles, CA | michelle.b@email.com | (555) 0109
https://www.linkedin.com/in/michellebrown

OPERATIONS MANAGER
8 years of operations and supply chain

PROFESSIONAL HISTORY
Operations Director | Manufacturing | 2021-Present (2 years)
- Managed operations for facility serving 500+ employees
- Reduced operational costs by 30% through process optimization
- Implemented lean manufacturing principles

Operations Manager | Logistics Company | 2018-2021 (3 years)
- Supervised supply chain operations
- Optimized warehouse processes improving efficiency by 40%
- Managed budget of $5M+

Operations Coordinator | E-Commerce | 2015-2018 (3 years)
- Coordinated order fulfillment and shipping
- Resolved supply chain issues

COMPETENCIES
Supply Chain Management | Process Optimization | Budget Planning
Team Management | Vendor Relations | Inventory Management`,
  },
  {
    name: 'Alexander Kim',
    email: 'alex.kim@email.com',
    phone: '+1-555-0110',
    linkedin: 'https://www.linkedin.com/in/alexanderkim',
    github: 'https://www.github.com/akim',
    text: `ALEXANDER KIM
San Diego, CA | alex.kim@email.com | (555) 0110
https://www.linkedin.com/in/alexanderkim | https://www.github.com/akim

SENIOR DATA ENGINEER
5 years of data engineering

EXPERIENCE
Senior Data Engineer | Big Data Company | 2021-Present (2 years)
- Designed data pipelines processing 1TB+ daily
- Built data warehouse supporting 200+ analysts
- Improved query performance by 70%

Data Engineer | Streaming Platform | 2019-2021 (2 years)
- Built real-time data processing systems
- Worked with Kafka and Apache Spark
- Handled petabyte-scale datasets

Junior Data Engineer | Analytics Company | 2018-2019 (1 year)
- Developed ETL processes
- Worked with SQL and Python

TECHNICAL EXPERTISE
Python | SQL | Spark | Hadoop | Kafka | Airflow
Cloud Platforms: AWS, GCP | Data Warehousing: Snowflake`,
  },
]

// Generate variations of the base resumes
function generateTestData(count = 25) {
  const cities = [
    'San Francisco, CA',
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Austin, TX',
    'Seattle, WA',
    'Boston, MA',
    'Denver, CO',
    'Miami, FL',
    'Portland, OR',
  ]

  const resumes = []

  for (let i = 0; i < count; i++) {
    const baseResume = FAKE_RESUMES[i % FAKE_RESUMES.length]
    const variation = Math.floor(i / FAKE_RESUMES.length)
    const cityIndex = (i + variation * 3) % cities.length

    // Create slight variations
    const name = `${baseResume.name.split(' ')[0]} ${baseResume.name.split(' ')[1]} ${variation > 0 ? `(${variation})` : ''}`
    const email = `${baseResume.name.split(' ')[0].toLowerCase()}.${baseResume.name.split(' ')[1].toLowerCase()}${variation > 0 ? variation : ''}@email.com`
    const text = baseResume.text.replace(
      /San Francisco, CA|New York, NY|Los Angeles, CA|Chicago, IL|Austin, TX|Seattle, WA|Boston, MA|Denver, CO|Miami, FL|Portland, OR/,
      cities[cityIndex]
    )

    resumes.push({
      name,
      email,
      phone: baseResume.phone,
      linkedin: baseResume.linkedin,
      github: baseResume.github,
      text,
    })
  }

  return resumes
}

async function seedDatabase(apiBaseUrl = 'http://localhost:3000') {
  console.log('🚀 Generating 30 test resumes...')
  const testResumes = generateTestData(30)

  console.log(`📤 Uploading ${testResumes.length} resumes to ${apiBaseUrl}...`)

  // Convert to File-like objects for FormData
  const formData = new FormData()

  for (const resume of testResumes) {
    // Create a mock file from the text
    const blob = new Blob([resume.text], { type: 'application/pdf' })
    const fileName = `${resume.name.replace(/\s+/g, '_')}.pdf`
    formData.append('files', blob, fileName)
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/upload-resume`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (response.ok) {
      console.log(`✅ Successfully uploaded ${data.uploadedCandidates.length} resumes`)

      if (data.errors && data.errors.length > 0) {
        console.log('⚠️ Errors:')
        data.errors.forEach((error) => console.log(`  - ${error}`))
      }

      // Trigger processing for each uploaded candidate
      console.log('🔄 Processing resumes with AI...')
      let processedCount = 0
      for (const candidate of data.uploadedCandidates) {
        try {
          const candidateRes = await fetch(
            `${apiBaseUrl}/api/candidates/${candidate.id}`
          )
          const candidateData = await candidateRes.json()

          const processRes = await fetch(`${apiBaseUrl}/api/process-resume`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              candidateId: candidate.id,
              scrubbedText: candidateData.candidate.scrubbed_text,
            }),
          })

          if (processRes.ok) {
            processedCount++
            console.log(`  ✓ Processed: ${candidate.name}`)
          }
        } catch (error) {
          console.log(`  ✗ Error processing ${candidate.name}:`, error)
        }
      }

      console.log(`\n✨ Complete! ${processedCount} resumes processed.`)
      console.log(`\n🎯 You can now view candidates at: ${apiBaseUrl}/search`)
    } else {
      console.error('❌ Upload failed:', data.error)
    }
  } catch (error) {
    console.error('❌ Network error:', error.message)
    console.log(
      '\n💡 Make sure your app is running at the specified URL before running this script.'
    )
  }
}

// Run with optional API URL from command line
const apiUrl = process.argv[2] || 'http://localhost:3000'
seedDatabase(apiUrl)
