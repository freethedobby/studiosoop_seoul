import { getFirestore } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin with hardcoded credentials
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: 'studiosoopseoul',
        clientEmail: 'firebase-adminsdk-fbsvc@studiosoopseoul.iam.gserviceaccount.com',
        privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCaHgfCUlNnr133\nuWeTgBCUjtHGZtgsVhjgUVRcNlGpT8xOtTS5zKWwgJSD04F6xMzIQbx30N707ZsQ\niiazH5f+xB9M/8PVZxSuVm18bp88bid/uPo+4OLiCXML2Bwg+5IautajVsXojMUF\nuALpECuLjc1nxpDsln+kHcXk2uDN+M61SM09+52yQlwpZdZhwd+padxZkyS0L9Gr\nNHeZNLoMqPTRbL5vUmpGj3NS2O8mpe9eHuJNnxfYB1shfC3inheCBIUBfXHf2g+M\ndCwEPWw+KyMG/KdpjkXVEi27tpWyunP08i5/aCf53BfsoU0YX0jF/6zPEBzRaLq+\nPmQLwpAHAgMBAAECggEAGQ5u1oIJ+16AmYj0NP/qMizyIB6SYMryqm2umHtgVXWa\n0uUVGGwUOBj/jFszvuEGJjzBxn0X8pw6zLqZRiAJ1yrNp/ghP63Np/Z3QHa/vtRt\n6Y8KaHSpjnRY1wEguaANBfmAcffmn0NbuO1M09WELuE0Fv4qi7yALg+FIAsR54qe\nUVNqbgBQMglkQ1C/gzYf0Y7v/uPKmg4/89l9fuxMuj8MPMipYWlkZ5Vmf0zEM58R\ndDeEfxKHo2NKp3fZXAQNydFYyW86+KuzR3N1u2CWiEiA32XbWhGaAvtU2g8Hylst\nj8DSnOj8u1vW9mvNQF2QW5uO/jstHUC746rR7qcAsQKBgQDWh72U1hKohFTYzx2X\nPu+zlLcGW6ZNQnTKsyxvV81DjvFN2Vq71m9w/xvdj1rPBfUICTEAIhW4d2Ru/Wy6\n0JMyQ5b1SbnGQqsUz4xLMWbPaY6yXn6w6m9NC+Xf+uZu1YU2jrU0UiT6pg8LPYFN\nkyQxKV/c/9mGIk5E+/trc/Tw3wKBgQC36LDgGWwcylMjFh6QrqN9CHN3HcPdbjPI\neWDTODT99k+I5GUvZ4rHFrsb+0yksgT+agZlrP1UkVC6PnongtYEsoULaQ3IHI4B\nLF61Mh5t6QhWnbXzOxRl+KQH2fKJe5Dgx5uDCXLm372FVnlDfJwd81xzoCpsSpTA\nFiTypar92QKBgETBRFVLNrejkb3aw1UR6qjXZME45lekkOHWAsu8jCC200dr/dRt\nqVHBsSCVLTlkY1+r8nRkeCmiuiGIPyywZDybxOngMxYDj+kfi4sdziFzZzRrbJcu\ny3UZ9xaNxwSGkicmHZUjLo7WYcPsdmByZAsNg5fEt+ZxYDxjtfR+OWZpAoGBAIGu\nppLPummuzeMO5Oy3CPfQ7sLPDV9mJ0O1O26V0uBGQJ1SGHvN8pEi2TwI/2mfUmAo\nWWx3CIgKlDdQeQjFfK8BR0ndgWdbo1L2e64fsk9kpImXWkcyoNaq9tfGev0xUd7/\nQgyrrAdbPCP67zWEd/2yrr2l8mQ8TxoIQ3OLGME5AoGBAIoGWUE0UZG4jwb9aN82\nxfc4bNyT95/x93KoTAUZ+p9XPvnpB7FgWCn1ws1Xk7aE6KNo+7GRLz4d4iw8YNpd\noOfm6wcAcjzuH1RDUC8nholRNK9x7Bcrr9/JwlvzzRcV6PbbRpfaCfq1Ttfwzgir\nBrcLpP88o+a1xdQ2W0kSw+ov\n-----END PRIVATE KEY-----\n'
      }),
      databaseURL: 'https://studiosoopseoul-default-rtdb.firebaseio.com/'
    });
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

const db = getFirestore();

export const ADMIN_EMAILS = [
  'blacksheepwall.xyz@gmail.com',
  'blacksheepwall.xyz@google.com',
  // ... existing admins ...
];

export async function isAdmin(email: string): Promise<boolean> {
  if (!email) return false;
  
  // Check hardcoded admin emails first
  if (ADMIN_EMAILS.includes(email)) {
    return true;
  }
  
  // Check if Firebase Admin is initialized
  if (!admin.apps.length) {
    console.log('Firebase Admin not initialized, using hardcoded admins only');
    return false;
  }
  
  // Check Firestore admins collection
  try {
    const adminDoc = await db.collection('admins').doc(email).get();
    return adminDoc.exists && adminDoc.data()?.isActive !== false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export async function addAdmin(email: string) {
  // Check if Firebase Admin is initialized
  if (!admin.apps.length) {
    throw new Error('Firebase Admin not initialized. Please set environment variables.');
  }
  
  try {
    await db.collection('admins').doc(email).set({
      email: email,
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    // Add to allowed emails if not already present
    if (!ADMIN_EMAILS.includes(email)) {
      ADMIN_EMAILS.push(email);
    }
    
    return true;
  } catch (error) {
    console.error('Error adding admin:', error);
    throw error;
  }
}

export async function removeAdmin(email: string) {
  // Check if Firebase Admin is initialized
  if (!admin.apps.length) {
    throw new Error('Firebase Admin not initialized. Please set environment variables.');
  }
  
  try {
    await db.collection('admins').doc(email).update({
      isActive: false,
    });
    
    // Remove from allowed emails
    const index = ADMIN_EMAILS.indexOf(email);
    if (index > -1) {
      ADMIN_EMAILS.splice(index, 1);
    }
    
    return true;
  } catch (error) {
    console.error('Error removing admin:', error);
    throw error;
  }
} 