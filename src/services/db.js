import { collection, addDoc, getDocs, query, where, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

const collectionName = 'projects';

export const submitProjectRequest = async (projectData) => {
  try {
    const newProject = {
      ...projectData,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      deliveredLink: null,
      paymentStatus: 'Pending'
    };
    const docRef = await addDoc(collection(db, collectionName), newProject);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error submitting project: ", error);
    return { success: false, error: error.message };
  }
};

export const getAllProjects = async () => {
  try {
    const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, data: projects };
  } catch (error) {
    console.error("Error getting projects: ", error);
    return { success: false, error: error.message, data: [] };
  }
};

export const getProjectByEmail = async (email) => {
  try {
    const q = query(collection(db, collectionName), where("email", "==", email));
    const snapshot = await getDocs(q);
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort manually to avoid index configuration requirements immediately
    projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { success: true, data: projects };
  } catch (error) {
    console.error("Error getting projects by email: ", error);
    return { success: false, error: error.message, data: [] };
  }
};

export const updateProjectStatus = async (projectId, updates) => {
  try {
    const projectRef = doc(db, collectionName, projectId);
    await updateDoc(projectRef, updates);
    return { success: true };
  } catch (error) {
    console.error("Error updating project: ", error);
    return { success: false, error: error.message };
  }
};
