'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { 
  collection, 
  query,
  where,
  getDocs,
  updateDoc,
  doc,
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
import styles from '../../add-property/add-property.module.css';

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const { user, userProfile, loading } = useAuth();
  const propertyId = params?.id;

  const [formData, setFormData] = useState({
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

  const [property, setProperty] = useState(null);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [newVideos, setNewVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load property data
  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId || !user) {
        setLoadingProperty(false);
        return;
      }

      try {
        const propertiesQuery = query(
          collection(db, 'properties'),
          where('uploadedBy', '==', user.uid)
        );
        const snapshot = await getDocs(propertiesQuery);
        const foundProperty = snapshot.docs.find(doc => doc.id === propertyId);

        if (!foundProperty) {
          setError('❌ Property not found or you do not have permission to edit it');
          setLoadingProperty(false);
          return;
        }

        const propertyData = foundProperty.data();
        setProperty({ ...propertyData, id: propertyId });
        
        // Populate form with existing data
        setFormData({
          title: propertyData.title || '',
          description: propertyData.description || '',
          location: propertyData.location || '',
          price: propertyData.price || '',
          type: propertyData.type || 'sell',
          propertyCategory: propertyData.propertyCategory || '',
          bedrooms: propertyData.bedrooms?.toString() || '',
          bathrooms: propertyData.bathrooms?.toString() || '',
          area: propertyData.area?.toString() || '',
          layout: propertyData.layout || '',
          superArea: propertyData.superArea?.toString() || '',
          superAreaUnit: propertyData.superAreaUnit || 'sqft',
          furnishing: propertyData.furnishing || '',
          facing: propertyData.facing || '',
          amenities: propertyData.amenities?.join(', ') || '',
          keyHighlights: propertyData.keyHighlights?.join(', ') || '',
        });
        
        setImages(propertyData.images || []);
        setVideos(propertyData.videos || []);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('❌ Error loading property: ' + err.message);
      } finally {
        setLoadingProperty(false);
      }
    };

    fetchProperty();
  }, [propertyId, user]);

  const validateForm = () => {
    const missingFields = [];
    
    if (!formData.title?.trim()) missingFields.push('Property Title');
    if (!formData.location?.trim()) missingFields.push('Location');
    if (!formData.price || formData.price <= 0) missingFields.push('Valid Price');
    if (!formData.type) missingFields.push('Property Type (Buy/Rent)');
    if (!formData.propertyCategory) missingFields.push('Property Category');
    
    if (images.length === 0 && newImages.length === 0) missingFields.push('At least 1 Image');
    
    if (missingFields.length > 0) {
      setError(`⚠️ Missing required fields:\n• ${missingFields.join('\n• ')}`);
      return false;
    }
    
    setError('');
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
  };

  const handleNewVideoChange = (e) => {
    const files = Array.from(e.target.files);
    setNewVideos(prev => [...prev, ...files]);
  };

  const removeExistingImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingVideo = (index) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewVideo = (index) => {
    setNewVideos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !propertyId) {
      setError('❌ User or property not found');
      return;
    }

    // Validate form first
    if (!validateForm()) {
      return;
    }

    // Prevent double submission
    if (uploading) {
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Upload new images
      const newImageUrls = [];
      for (let i = 0; i < newImages.length; i++) {
        const file = newImages[i];
        const storageRef = ref(storage, `properties/${user.uid}/${Date.now()}_img_${i}_${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        newImageUrls.push(downloadURL);
      }

      // Upload new videos
      const newVideoUrls = [];
      for (let i = 0; i < newVideos.length; i++) {
        const file = newVideos[i];
        const storageRef = ref(storage, `properties/${user.uid}/${Date.now()}_vid_${i}_${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        newVideoUrls.push(downloadURL);
      }

      // Combine old and new images/videos
      const allImages = [...images, ...newImageUrls];
      const allVideos = [...videos, ...newVideoUrls];

      // Update property in Firestore
      const propertyRef = doc(db, 'properties', propertyId);
      await updateDoc(propertyRef, {
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
        bankAuction: formData.type === 'auction',
        amenities: formData.amenities ? formData.amenities.split(',').map(a => a.trim()).filter(a => a) : [],
        keyHighlights: formData.keyHighlights ? formData.keyHighlights.split(',').map(h => h.trim()).filter(h => h) : [],
        images: allImages,
        videos: allVideos,
        updatedAt: serverTimestamp(),
      });

      console.log('✅ Property updated with ID:', propertyId);

      setSuccess('✅ Property updated successfully!');
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/owner');
      }, 2000);

    } catch (err) {
      console.error('❌ Error updating property:', err);
      setError('❌ Error updating property: ' + err.message);
      setUploading(false);
    }
  };

  if (loading || loadingProperty) {
    return <div className={styles.container}>Loading...</div>;
  }

  if (!user || !property) {
    return <div className={styles.container}>Please log in first or property not found</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.form_wrapper}>
        <h1>Edit Property</h1>

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
                <option value="auction">Bank Auction</option>
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
                <option value="1RK">1 RK</option>
                <option value="1BHK">1 BHK</option>
                <option value="2BHK">2 BHK</option>
                <option value="3BHK">3 BHK</option>
                <option value="4BHK">4 BHK</option>
                <option value="5BHK">5 BHK</option>
              </select>
            </div>
          </div>

          <div className={styles.form_row}>
            <div className={styles.form_group}>
              <label htmlFor="superArea">Super Area (sq ft)</label>
              <input
                type="number"
                id="superArea"
                name="superArea"
                value={formData.superArea}
                onChange={handleInputChange}
                placeholder="e.g., 2000"
              />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="superAreaUnit">Unit</label>
              <select
                id="superAreaUnit"
                name="superAreaUnit"
                value={formData.superAreaUnit}
                onChange={handleInputChange}
              >
                <option value="sqft">Sq. Ft.</option>
                <option value="sqm">Sq. M.</option>
              </select>
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
            <label htmlFor="images">Existing Images</label>
            {images.length > 0 && (
              <div className={styles.image_preview}>
                <h3>Current Images ({images.length})</h3>
                <div className={styles.image_grid}>
                  {images.map((url, index) => (
                    <div key={index} className={styles.image_item}>
                      <img src={url} alt={`Property ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className={styles.remove_btn}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.form_group}>
            <label htmlFor="newImages">Add New Images (Optional)</label>
            <input
              type="file"
              id="newImages"
              multiple
              accept="image/*"
              onChange={handleNewImageChange}
            />
            <p className={styles.help_text}>Add more images to your listing</p>
          </div>

          {newImages.length > 0 && (
            <div className={styles.image_preview}>
              <h3>New Images ({newImages.length})</h3>
              <div className={styles.image_grid}>
                {newImages.map((file, index) => (
                  <div key={index} className={styles.image_item}>
                    <p>{file.name}</p>
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className={styles.remove_btn}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.form_group}>
            <label htmlFor="newVideos">Add New Videos (Optional)</label>
            <input
              type="file"
              id="newVideos"
              multiple
              accept="video/*"
              onChange={handleNewVideoChange}
            />
            <p className={styles.help_text}>Add videos to showcase your property</p>
          </div>

          {newVideos.length > 0 && (
            <div className={styles.image_preview}>
              <h3>New Videos ({newVideos.length})</h3>
              <div className={styles.image_grid}>
                {newVideos.map((file, index) => (
                  <div key={index} className={styles.image_item}>
                    <p>{file.name}</p>
                    <button
                      type="button"
                      onClick={() => removeNewVideo(index)}
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
            disabled={uploading}
            className={styles.submit_btn}
          >
            {uploading ? '⏳ Updating...' : '💾 Update Property'}
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
