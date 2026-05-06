// src/lib/firestore.js
import {
  collection, addDoc, getDocs, getDoc, doc,
  updateDoc, deleteDoc, query, orderBy, where,
  serverTimestamp, onSnapshot,
} from 'firebase/firestore'
import { db } from './firebase'

const LEADS_COL = 'leads'
const NOTES_COL = 'notes'

// ── Leads ────────────────────────────────────────────────
export const createLead = async (data) => {
  const ref = await addDoc(collection(db, LEADS_COL), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export const updateLead = async (id, data) => {
  await updateDoc(doc(db, LEADS_COL, id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export const deleteLead = async (id) => {
  await deleteDoc(doc(db, LEADS_COL, id))
  // also delete notes
  const q = query(collection(db, NOTES_COL), where('leadId', '==', id))
  const snap = await getDocs(q)
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)))
}

export const getLead = async (id) => {
  const snap = await getDoc(doc(db, LEADS_COL, id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export const subscribeLeads = (callback) => {
  const q = query(collection(db, LEADS_COL), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

// ── Notes ────────────────────────────────────────────────
export const addNote = async (leadId, content, createdBy) => {
  await addDoc(collection(db, NOTES_COL), {
    leadId,
    content,
    createdBy,
    createdAt: serverTimestamp(),
  })
}

export const subscribeNotes = (leadId, callback) => {
  const q = query(
    collection(db, NOTES_COL),
    where('leadId', '==', leadId),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}
