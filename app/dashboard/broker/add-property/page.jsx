'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { 
  canUploadProperty, 
  incrementFreeUploads 
} from '@/lib/uploadLimitUtils';
import { 
  collection, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import styles from './add-property.module.css';

export default function AddPropertyPage() {
  const router = useRouter();
  const { user, userProfile, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    type: 'sell',
    bedrooms: '',
    bathrooms: '',
    area: '',
    amenities: '',
  });

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadLimit, setUploadLimit] = useState(null);

  useEffect(() => {
    if (!loading && user) {
      checkUploadLimit();
    }
  }, [user, loading]);

  const checkUploadLimit = async () => {
    try {
      const canUpload = await canUploadProperty(user.uid);
      setUploadLimit(canUpload);
      if (!canUpload) {
        setError('❌ You have reached your upload limit. Please upgrade your subscription.');
      }
    } catch (err) {
      console.error('Error checking upload limit:', err);
      setError('Error checking upload limit: ' + err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('User not authenticated');
      return;
    }

    // Check upload limit
    const canUpload = await canUploadProperty(user.uid);
    if (!canUpload) {
      setError('❌ You have reached your upload limit. Please upgrade your subscription.');
      return;
    }

    // Validate form
    if (!formData.title || !formData.location || !formData.price) {
      setError('❌ Please fill in all required fields');
      return;
    }

    if (images.length === 0) {
      setError('❌ Please upload at least one image');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Upload images to Firebase Storage
      const imageUrls = [];
      
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const storageRef = ref(storage, `properties/${user.uid}/${Date.now()}_${i}_${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        imageUrls.push(downloadURL);
      }

      console.log('✅ Images uploaded:', imageUrls);

      // Save property to Firestore
      const propertyData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        price: parseFloat(formData.price),
        type: formData.type,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : 0,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : 0,
        area: formData.area ? parseFloat(formData.area) : 0,
        amenities: formData.amenities ? formData.amenities.split(',').map(a => a.trim()) : [],
        images: imageUrls,
        uploadedBy: user.uid,
        ownerName: userProfile?.name || 'Unknown',
        ownerEmail: user.email,
        createdAt: serverTimestamp(),
        status: 'active',
      };

      // Add document to Firestore
      const docRef = await addDoc(
        collection(db, 'properties'),
        propertyData
      );

      console.log('✅ Property created with ID:', docRef.id);

      // Increment free uploads if applicable
      await incrementFreeUploads(user.uid);

      setSuccess('✅ Property uploaded successfully!');
      setFormData({
        title: '',
        description: '',
        location: '',
        price: '',
        type: 'sell',
        bedrooms: '',
        bathrooms: '',
        area: '',
        amenities: '',
      });
      setImages([]);

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/broker');
      }, 2000);

    } catch (err) {
      console.error('❌ Error uploading property:', err);
      setError('❌ Error uploading property: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className={styles.container}>Loading...</div>;

  if (!user) return <div className={styles.container}>Please log in first</div>;

  return (
    <div className={styles.container}>
      <div className={styles.form_wrapper}>
        <h1 className={styles.title}>Add New Property</h1>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {success && (
          <div className={styles.success}>
            {success}
          </div>
        )}

        {uploadLimit === false && (
          <div className={styles.limit_warning}>
            <p>📦 You have reached your upload limit for free users.</p>
            <button 
              onClick={() => router.push('/subscription')}
              style={{ marginTop: '10px' }}
            >
              Upgrade Subscription
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.form_group}>
            <label htmlFor="title">Property Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Commercial Space in Business District"
              required
            />
          </div>

          <div className={styles.form_group}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your property..."
              rows="4"
            />
          </div>

          <div className={styles.form_row}>
            <div className={styles.form_group}>
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Delhi, India"
                required
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="type">Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="sell">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
          </div>

          <div className={styles.form_row}>
            <div className={styles.form_group}>
              <label htmlFor="price">Price (₹) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 2500000"
                required
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="area">Area (sq ft)</label>
              <input
                type="number"
                id="area"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                placeholder="e.g., 2000"
              />
            </div>
          </div>

          <div className={styles.form_row}>
            <div className={styles.form_group}>
              <label htmlFor="bedrooms">Bedrooms</label>
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                placeholder="e.g., 5"
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="bathrooms">Bathrooms</label>
              <input
                type="number"
                id="bathrooms"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                placeholder="e.g., 3"
              />
            </div>
          </div>

          <div className={styles.form_group}>
            <label htmlFor="amenities">Amenities (comma separated)</label>
            <input
              type="text"
              id="amenities"
              name="amenities"
              value={formData.amenities}
              onChange={handleInputChange}
              placeholder="e.g., Elevator, Security, Conference Room, Cafeteria"
            />
          </div>

          <div className={styles.form_group}>
            <label htmlFor="images">Upload Images *</label>
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            <p className={styles.help_text}>Max 5 images recommended</p>
          </div>

          {images.length > 0 && (
            <div className={styles.image_preview}>
              <h3>Selected Images ({images.length})</h3>
              <div className={styles.image_grid}>
                {images.map((file, index) => (
                  <div key={index} className={styles.image_item}>
                    <p>{file.name}</p>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className={styles.remove_btn}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || uploadLimit === false}
            className={styles.submit_btn}
          >
            {uploading ? '⏳ Uploading...' : '📤 Upload Property'}
          </button>
        </form>

        <button
          onClick={() => router.push('/dashboard/broker')}
          className={styles.back_btn}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
