import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  limit,
  doc,
  updateDoc,
  increment,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

// Create a new post
export const createPost = async (content, authorId, authorName, tags = []) => {
  try {
    const postRef = await addDoc(collection(db, 'posts'), {
      content,
      authorId,
      authorName,
      tags,
      likes: [],
      comments: [],
      createdAt: serverTimestamp(),
      likeCount: 0,
      commentCount: 0
    });
    return { success: true, postId: postRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all posts
export const getPosts = async (maxPosts = 50) => {
  try {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(maxPosts)
    );
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, posts };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get posts by tag
export const getPostsByTag = async (tag) => {
  try {
    const q = query(
      collection(db, 'posts'),
      where('tags', 'array-contains', tag),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, posts };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Like a post
export const likePost = async (postId, userId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      return { success: false, error: 'Post not found' };
    }
    
    const postData = postDoc.data();
    const likes = postData.likes || [];
    const isLiked = likes.includes(userId);
    
    if (isLiked) {
      // Unlike
      await updateDoc(postRef, {
        likes: likes.filter(id => id !== userId),
        likeCount: increment(-1)
      });
      return { success: true, liked: false };
    } else {
      // Like
      await updateDoc(postRef, {
        likes: [...likes, userId],
        likeCount: increment(1)
      });
      return { success: true, liked: true };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Add comment to post
export const addComment = async (postId, userId, userName, commentText) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      return { success: false, error: 'Post not found' };
    }
    
    const postData = postDoc.data();
    const comments = postData.comments || [];
    
    const newComment = {
      userId,
      userName,
      text: commentText,
      createdAt: serverTimestamp()
    };
    
    await updateDoc(postRef, {
      comments: [...comments, newComment],
      commentCount: increment(1)
    });
    
    return { success: true, comment: newComment };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

