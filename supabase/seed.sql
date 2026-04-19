-- Profile
INSERT INTO profile (name, title, tagline, bio, email, phone, linkedin) VALUES (
  'Hafizh Fauzan',
  'Credit Risk Data Scientist',
  '4+ years building regulatory-grade scorecards and ML models on national-scale credit data. Specialized in risk strategy, feature engineering, and translating complex data insights for financial institutions.',
  'Credit Risk Data Scientist with 4+ years of experience across Banking, Multi-Finance, and Credit Bureau sectors. Specialized in building regulatory-grade Scorecards and ML models on massive datasets (100M+ subjects). Proven track record of leveraging national-scale credit data to drive risk strategy and revenue growth. Led cross-functional teams to boost leads. Proficient in Python, SQL, PySpark, and ML, focusing on actionable insights. Demonstrated leadership in data forums and bridging technical-business communication.',
  'hayeef8@gmail.com',
  '+62 812 2154 6465',
  'https://www.linkedin.com/in/hafizhf/'
);

-- Stats (target + suffix = animated counter; null target = static display)
INSERT INTO stats (label, value, target, suffix, sort_order) VALUES
  ('Years Experience',           '4+',    4,   '+',  0),
  ('Credit Subjects Analyzed',   '100M+', 100, 'M+', 1),
  ('Financial Institutions',     '30+',   30,  '+',  2),
  ('Approval Rate Lift',         '20–30%', NULL, NULL, 3);

-- Experience
INSERT INTO experience (company, role, period, description, is_current, sort_order) VALUES
(
  'CRIF Lembaga Informasi Keuangan',
  'Senior Analytics Consultant',
  'Jan 2024 - Present',
  ARRAY[
    'Developed and delivered multiple <strong>behavioral Scorecard models</strong> on the entire Indonesian credit data, combined with Telco data, on <strong>100+ million subjects</strong>.',
    'Built a <strong>high-dimensional feature store of 15,000+ derived attributes</strong> from raw SLIK data. Applied IV binning, missing value imputation, and feature clustering to reduce dimensionality to ~100 predictive features.',
    'Led the <strong>full model lifecycle PoC</strong> for 30+ major financial institutions - from segmentation analysis to model deployment. Established automated monitoring using PSI and GINI to detect model drift.',
    'Conducted <strong>Cut-Off analysis and Reject Inference</strong> to optimize risk strategy, achieving <strong>20–30% higher approval rates</strong> while maintaining flat NPL rates.',
    'Presented proof-of-concept solutions to key executives at <strong>50+ large financial institutions</strong>.',
    'Collaborated with the <strong>International CRIF team</strong> on Application, Behavioral, and Collection scorecards.',
    'Executed high-value <strong>market research projects</strong> (worth billions IDR) on Credit Card, BNPL, Personal Loan, and more.',
    'Served as <strong>acting Technical Lead</strong> for a squad of 3+ Analytics Consultants and Interns - conducting code reviews, overseeing delivery quality, and mentoring juniors.',
    'Created and maintained <strong>data-driven dashboards</strong> providing clients with real-time strategic insights.'
  ],
  true, 0
),
(
  'Astra Financial',
  'Data Scientist',
  'Nov 2022 - Jan 2024',
  ARRAY[
    'Led a major <strong>cross-sell and upsell project</strong>, driving a <strong>78% increase in valid leads</strong> and a <strong>35% rise in GMV</strong> across FIFGROUP, Astra Credit Companies, and Toyota Astra Financial Services.',
    'Led the <strong>Data Analytics Forum</strong> for Astra Financial and its subsidiaries, fostering collaboration and knowledge-sharing across data teams.',
    'Managed <strong>end-to-end ML model development</strong> for predictive analysis, improving targeting strategies and driving business growth.',
    'Collaborated with product and marketing teams to deliver <strong>actionable insights</strong> based on customer behavior.'
  ],
  false, 1
),
(
  'Bank Sinarmas',
  'Data Scientist → Data Science Graduate Camp (MT)',
  'Jun 2021 - Nov 2022',
  ARRAY[
    'Led development of a <strong>customer segmentation model</strong> using PySpark and Apache Spark, improving targeting capabilities.',
    'Delivered <strong>explainable AI solutions</strong>, enabling stakeholders to understand model outputs and make confident data-driven decisions.',
    'Presented comprehensive findings to <strong>senior leadership</strong>, translating complex data insights into actionable strategies.',
    'Led a key segmentation project resulting in improved marketing and product targeting strategies.'
  ],
  false, 2
);

-- Skills
INSERT INTO skills (name, category, is_dark, sort_order) VALUES
  ('Python',               'Programming',           true,  0),
  ('SQL',                  'Programming',           true,  1),
  ('PySpark',              'Programming',           true,  2),
  ('Predictive Modeling',  'ML & Analytics',        true,  3),
  ('Feature Engineering',  'ML & Analytics',        true,  4),
  ('Risk Analysis',        'ML & Analytics',        true,  5),
  ('Hadoop',               'Big Data',              false, 6),
  ('Apache Spark',         'Big Data',              false, 7),
  ('Tableau',              'Visualization & Tools', false, 8),
  ('Power BI',             'Visualization & Tools', false, 9),
  ('Git',                  'Visualization & Tools', false, 10),
  ('MS Excel',             'Visualization & Tools', false, 11);
