-- Seed data: 3 compliance trainings
-- Using a check to avoid duplicate inserts on restart
INSERT INTO trainings (title, description, status)
SELECT 'Cyber Security Awareness', 'This training covers essential cybersecurity practices including password management, phishing awareness, and data protection protocols.', 'ACTIVE'
WHERE NOT EXISTS (SELECT 1 FROM trainings WHERE title = 'Cyber Security Awareness');

INSERT INTO trainings (title, description, status)
SELECT 'GDPR Compliance Training', 'Learn about the General Data Protection Regulation, individual rights, data breach notification procedures, and organizational compliance requirements.', 'ACTIVE'
WHERE NOT EXISTS (SELECT 1 FROM trainings WHERE title = 'GDPR Compliance Training');

INSERT INTO trainings (title, description, status)
SELECT 'Employee Code of Conduct', 'Comprehensive training on workplace behavior expectations, anti-harassment policies, conflict of interest guidelines, and confidentiality requirements.', 'PENDING'
WHERE NOT EXISTS (SELECT 1 FROM trainings WHERE title = 'Employee Code of Conduct');
