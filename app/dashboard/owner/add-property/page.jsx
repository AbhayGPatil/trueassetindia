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
import AmenitiesSelector from '@/components/AmenitiesSelector';
import KeyHighlightsSelector from '@/components/KeyHighlightsSelector';
import styles from './add-property.module.css';

export default function AddPropertyPage() {
  const router = useRouter();
  const { user, userProfile, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    type: 'sell', // or 'rent'
    propertyCategory: '', // apartment, villa, plot, penthouse, commercial, rowhouse
    bedrooms: '',
    bathrooms: '',
    area: '', // in sq ft
    layout: '', // 1BHK, 2BHK, etc
    superArea: '', // Super area in sq ft
    superAreaUnit: 'sqft', // sqft or sqm
    furnishing: '', // SEMI, FULL, NOT
    facing: '', // EAST, WEST, SOUTH, NORTH, NE, NW, SE, SW
    amenities: '', // comma separated
    keyHighlights: '', // comma separated
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
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

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    setVideos(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
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
        const storageRef = ref(storage, `properties/${user.uid}/${Date.now()}_img_${i}_${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        imageUrls.push(downloadURL);
      }

      // Upload videos to Firebase Storage
      const videoUrls = [];
      
      for (let i = 0; i < videos.length; i++) {
        const file = videos[i];
        const storageRef = ref(storage, `properties/${user.uid}/${Date.now()}_vid_${i}_${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        videoUrls.push(downloadURL);
      }

      console.log('✅ Images uploaded:', imageUrls);
      console.log('✅ Videos uploaded:', videoUrls);

      // Save property to Firestore
      const propertyData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        price: parseFloat(formData.price),
        type: formData.type,
        propertyCategory: formData.propertyCategory,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : 0,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : 0,
        area: formData.area ? parseFloat(formData.area) : 0,
        layout: formData.layout,
        superArea: formData.superArea ? parseFloat(formData.superArea) : 0,
        superAreaUnit: formData.superAreaUnit,
        furnishing: formData.furnishing,
        facing: formData.facing,
        amenities: formData.amenities ? formData.amenities.split(',').map(a => a.trim()) : [],
        keyHighlights: formData.keyHighlights ? formData.keyHighlights.split(',').map(h => h.trim()) : [],
        images: imageUrls,
        videos: videoUrls,
        uploadedBy: user.uid,
        ownerName: userProfile?.name || 'Unknown',
        ownerEmail: user.email,
        ownerPhone: userProfile?.whatsapp || userProfile?.phone || '',
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
        propertyCategory: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        layout: '',
        superArea: '',
        superAreaUnit: 'sqft',
        furnishing: '',
        facing: '',
        amenities: '',
        keyHighlights: '',
      });
      setImages([]);
      setVideos([]);

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/owner');
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
        <h1>Add New Property</h1>

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
              placeholder="e.g., Beautiful 3BHK Apartment in Mumbai"
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
                placeholder="e.g., Mumbai, Maharashtra"
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

            <div className={styles.form_group}>
              <label htmlFor="propertyCategory">Property Category *</label>
              <select
                id="propertyCategory"
                name="propertyCategory"
                value={formData.propertyCategory}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
                <option value="penthouse">Penthouse</option>
                <option value="commercial">Commercial</option>
                <option value="rowhouse">Row House</option>
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
                placeholder="e.g., 5000000"
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
                placeholder="e.g., 1500"
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
                placeholder="e.g., 3"
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
                placeholder="e.g., 2"
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="layout">Layout</label>
              <select
                id="layout"
                name="layout"
                value={formData.layout}
                onChange={handleInputChange}
              >
                <option value="">Select Layout</option>
                <option value="1BHK">1 BHK</option>
                <option value="2BHK">2 BHK</option>
                <option value="3BHK">3 BHK</option>
                <option value="4BHK">4 BHK</option>
                <option value="5BHK">5 BHK</option>
                <option value="Studio">Studio</option>
                <option value="Penthouse">Penthouse</option>
              </select>
            </div>
          </div>

          <div className={styles.form_row}>
            <div className={styles.form_group}>
              <label htmlFor="superArea">Super Area</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="number"
                  id="superArea"
                  name="superArea"
                  value={formData.superArea}
                  onChange={handleInputChange}
                  placeholder="e.g., 1800"
                  style={{ flex: 1 }}
                />
                <select
                  name="superAreaUnit"
                  value={formData.superAreaUnit}
                  onChange={handleInputChange}
                  style={{ width: '100px' }}
                >
                  <option value="sqft">Sq.ft</option>
                  <option value="sqm">Sq.m</option>
                </select>
              </div>
            </div>

            <div className={styles.form_group}>
              <label htmlFor="furnishing">Furnishing</label>
              <select
                id="furnishing"
                name="furnishing"
                value={formData.furnishing}
                onChange={handleInputChange}
              >
                <option value="">Select Furnishing</option>
                <option value="NOT">Not Furnished</option>
                <option value="SEMI">Semi Furnished</option>
                <option value="FULL">Fully Furnished</option>
              </select>
            </div>

            <div className={styles.form_group}>
              <label htmlFor="facing">Facing</label>
              <select
                id="facing"
                name="facing"
                value={formData.facing}
                onChange={handleInputChange}
              >
                <option value="">Select Facing</option>
                <option value="EAST">East</option>
                <option value="WEST">West</option>
                <option value="SOUTH">South</option>
                <option value="NORTH">North</option>
                <option value="NORTHEAST">North East</option>
                <option value="NORTHWEST">North West</option>
                <option value="SOUTHEAST">South East</option>
                <option value="SOUTHWEST">South West</option>
              </select>
            </div>
          </div>

          <div className={styles.form_group}>
            <label>Key Highlights - Why Choose This Property?</label>
            <KeyHighlightsSelector
              value={formData.keyHighlights}
              onChange={(value) => setFormData(prev => ({
                ...prev,
                keyHighlights: value
              }))}
            />
          </div>

          <div className={styles.form_group}>
            <label>Amenities</label>
            <AmenitiesSelector
              value={formData.amenities}
              onChange={(value) => setFormData(prev => ({
                ...prev,
                amenities: value
              }))}
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

          <div className={styles.form_group}>
            <label htmlFor="videos">Upload Videos (Optional)</label>
            <input
              type="file"
              id="videos"
              multiple
              accept="video/*"
              onChange={handleVideoChange}
            />
            <p className={styles.help_text}>Supported: MP4, WebM, OGG (Max 100MB per video)</p>
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

          {videos.length > 0 && (
            <div className={styles.image_preview}>
              <h3>Selected Videos ({videos.length})</h3>
              <div className={styles.image_grid}>
                {videos.map((file, index) => (
                  <div key={index} className={styles.image_item}>
                    <p>🎥 {file.name}</p>
                    <button
                      type="button"
                      onClick={() => removeVideo(index)}
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
          onClick={() => router.push('/dashboard/owner')}
          className={styles.back_btn}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
