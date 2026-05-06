const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccount.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const auth = admin.auth()
const db = admin.firestore()

const LEADS = [
  { name: 'Sarah Johnson', company: 'TechCorp Inc.', email: 'sarah@techcorp.com', phone: '+1 555-0101', source: 'LinkedIn', assignedTo: 'Alex Rivera', status: 'Qualified', dealValue: 45000 },
  { name: 'Marcus Chen', company: 'DataFlow Systems', email: 'marcus@dataflow.io', phone: '+1 555-0102', source: 'Website', assignedTo: 'Jordan Lee', status: 'New', dealValue: 18000 },
  { name: 'Priya Patel', company: 'CloudBase Ltd.', email: 'priya@cloudbase.com', phone: '+1 555-0103', source: 'Referral', assignedTo: 'Sam Chen', status: 'Won', dealValue: 92000 },
  { name: 'Lucas Williams', company: 'StartupHub', email: 'lucas@startuphub.co', phone: '+1 555-0104', source: 'Cold Email', assignedTo: 'Morgan Davis', status: 'Contacted', dealValue: 7500 },
  { name: 'Emma Rodriguez', company: 'Nexus Solutions', email: 'emma@nexus.com', phone: '+1 555-0105', source: 'Event', assignedTo: 'Casey Kim', status: 'Proposal Sent', dealValue: 63000 },
  { name: 'David Kim', company: 'Vertex Analytics', email: 'david@vertex.ai', phone: '+1 555-0106', source: 'LinkedIn', assignedTo: 'Alex Rivera', status: 'Lost', dealValue: 31000 },
  { name: 'Aisha Thompson', company: 'FutureTech', email: 'aisha@futuretech.io', phone: '+1 555-0107', source: 'Social Media', assignedTo: 'Jordan Lee', status: 'New', dealValue: 22000 },
  { name: 'Raj Sharma', company: 'BrightPath Corp', email: 'raj@brightpath.com', phone: '+1 555-0108', source: 'Referral', assignedTo: 'Sam Chen', status: 'Qualified', dealValue: 55000 },
]

async function seed() {
  console.log('Seeding Firebase...\n')

  try {
    await auth.getUserByEmail('admin@example.com')
    console.log('✓ Admin user already exists')
  } catch {
    await auth.createUser({
      email: 'admin@example.com',
      password: 'password123',
      displayName: 'Admin User',
    })
    console.log('✓ Created admin user: admin@example.com / password123')
  }

  const batch = db.batch()
  for (const lead of LEADS) {
    const ref = db.collection('leads').doc()
    batch.set(ref, {
      ...lead,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: 'admin@example.com',
    })
  }
  await batch.commit()
  console.log(`✓ Created ${LEADS.length} sample leads`)
  console.log('\n🎉 Done! Login: admin@example.com / password123')
  process.exit(0)
}

seed().catch(e => { console.error(e); process.exit(1) })