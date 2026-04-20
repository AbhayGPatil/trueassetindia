'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/lib/AuthContext';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AmenitiesSelector from '@/components/AmenitiesSelector';
import KeyHighlightsSelector from '@/components/KeyHighlightsSelector';
import styles from './launch-project.module.css';

// Railway stations in India
const RAILWAY_STATIONS = [
  'Central Railway Station', 'Western Railway Station', 'Suburban Railway Station',
  'Metro Station - Blue Line', 'Metro Station - Red Line', 'Metro Station - Green Line',
  'Metro Station - Yellow Line', 'Metro Station - Purple Line',
  'Local Train Station - Churchgate', 'Local Train Station - Dadar',
  'Local Train Station - Bandra', 'Local Train Station - Andheri',
];

// Areas for search
const AREAS_LIST = [
  'Worli', 'BKC', 'Bandra', 'Juhu', 'Kharghar', 'Thane West', 'Lower Parel',
  'Colaba', 'South Mumbai', 'Navi Mumbai', 'Powai', 'Hinjewadi', 'Wakad',
  'Kharadi', 'Viman Nagar', 'Kalyani Nagar', 'Aundh', 'Pune', 'Mumbai',
];

// Layout options
const LAYOUT_OPTIONS = ['1RK', '1BHK', '2BHK', '3BHK', '4BHK'];

// Furnishing options
const FURNISHING_OPTIONS = ['NOT FURNISHED', 'SEMI FURNISHED', 'FULLY FURNISHED'];

export default function LaunchProjectPage() {
  const router = useRouter();
  const { user, userProfile: profile } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    projectName: '',
    city: '',
    location: '',
    type: 'under_development', // under_development, ready_to_move, new_launched, redeveloped
    naStatus: 'not_required', // obtained, in_progress, not_required
    propertyCategory: 'apartment_blocks', // Fixed
    numberOfFloors: '',
    wings: '',
    furnishing: 'not_furnished',
    nearbyStation: '',
    selectedLayouts: [], // Array of layout types
    layoutSizes: {}, // { '1RK': 450, '1BHK': 650, ... }
    amenities: [],
    keyHighlights: [],
    areaSize: '',
  });

  const [files, setFiles] = useState({
    naCertificate: null,
    images: [],
    videos: [],
  });

  const [newArea, setNewArea] = useState('');
  const [showAddArea, setShowAddArea] = useState(false);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle layout selection
  const handleLayoutToggle = (layout) => {
    setFormData(prev => ({
      ...prev,
      selectedLayouts: prev.selectedLayouts.includes(layout)
        ? prev.selectedLayouts.filter(l => l !== layout)
        : [...prev.selectedLayouts, layout]
    }));
  };

  // Handle layout size input
  const handleLayoutSizeChange = (layout, size) => {
    setFormData(prev => ({
      ...prev,
      layoutSizes: {
        ...prev.layoutSizes,
        [layout]: size ? parseInt(size) : ''
      }
    }));
  };

  // Handle file uploads
  const handleFileChange = (e, fileType) => {
    const { files: uploadedFiles } = e.target;
    
    if (fileType === 'naCertificate') {
      setFiles(prev => ({
        ...prev,
        naCertificate: uploadedFiles[0] || null
      }));
    } else if (fileType === 'images') {
      const imageArray = Array.from(uploadedFiles).slice(0, 10 - files.images.length);
      setFiles(prev => ({
        ...prev,
        images: [...prev.images, ...imageArray]
      }));
    } else if (fileType === 'videos') {
      const videoArray = Array.from(uploadedFiles).slice(0, 2 - files.videos.length);
      setFiles(prev => ({
        ...prev,
        videos: [...prev.videos, ...videoArray]
      }));
    }
  };

  // Remove file from array
  const removeFile = (fileType, index) => {
    if (fileType === 'images') {
      setFiles(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } else if (fileType === 'videos') {
      setFiles(prev => ({
        ...prev,
        videos: prev.videos.filter((_, i) => i !== index)
      }));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (!user) throw new Error('User not authenticated');
      if (!formData.projectName) throw new Error('Project name is required');
      if (!formData.city) throw new Error('City is required');
      if (!formData.location) throw new Error('Location is required');
      if (formData.selectedLayouts.length === 0) throw new Error('Select at least one layout');
      if (files.images.length === 0) throw new Error('Upload at least one image');

      // Upload files to Firebase Storage
      const uploadedImageUrls = [];
      const uploadedVideoUrls = [];
      let naCertificateUrl = null;

      // Upload images
      for (const image of files.images) {
        const imageRef = ref(storage, `developer-projects/${user.uid}/${Date.now()}-${image.name}`);
        await uploadBytes(imageRef, image);
        const url = await getDownloadURL(imageRef);
        uploadedImageUrls.push(url);
      }

      // Upload videos
      for (const video of files.videos) {
        const videoRef = ref(storage, `developer-projects/${user.uid}/${Date.now()}-${video.name}`);
        await uploadBytes(videoRef, video);
        const url = await getDownloadURL(videoRef);
        uploadedVideoUrls.push(url);
      }

      // Upload NA Certificate if provided
      if (files.naCertificate) {
        const naCertRef = ref(storage, `developer-projects/${user.uid}/na-certificate-${Date.now()}`);
        await uploadBytes(naCertRef, files.naCertificate);
        naCertificateUrl = await getDownloadURL(naCertRef);
      }

      // Save project to Firestore
      const projectData = {
        uploadedBy: user.uid,
        title: formData.projectName,
        city: formData.city,
        location: formData.location,
        type: formData.type,
        naStatus: formData.naStatus,
        naCertificateUrl: naCertificateUrl,
        propertyCategory: formData.propertyCategory,
        numberOfFloors: parseInt(formData.numberOfFloors) || 0,
        wings: formData.wings,
        furnishing: formData.furnishing,
        nearbyStation: formData.nearbyStation,
        selectedLayouts: formData.selectedLayouts,
        layoutSizes: formData.layoutSizes,
        amenities: formData.amenities,
        keyHighlights: formData.keyHighlights,
        images: uploadedImageUrls,
        videos: uploadedVideoUrls,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const projectRef = await addDoc(collection(db, 'properties'), projectData);

      setSuccessMsg('Project launched successfully! 🎉');
      setTimeout(() => {
        router.push('/dashboard/developer');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to launch project');
    } finally {
      setLoading(false);
    }
  };

  if (!user || profile?.role !== 'developer') {
    return <div className={styles.loading}>Redirecting...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          ← Back
        </button>
        <h1 className={styles.title}>Launch New Project</h1>
        <p className={styles.subtitle}>Fill in project details to showcase your development to investors</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.errorBanner}>{error}</div>}
        {successMsg && <div className={styles.successBanner}>{successMsg}</div>}

        {/* Section 1: Basic Info */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Project Information</h2>

          <div className={styles.formGroup}>
            <label>Project Name *</label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              placeholder="e.g., Luxury Towers, Green Valley Complex"
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>City *</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              >
                <option value="">Select City</option>
                <option value="mumbai">Mumbai</option>
                <option value="pune">Pune</option>
                <option value="bangalore">Bangalore</option>
                <option value="delhi">Delhi</option>
                <option value="hyderabad">Hyderabad</option>
                <option value="kolkata">Kolkata</option>
                <option value="chennai">Chennai</option>
                <option value="goa">Goa</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Property Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="under_development">Under Development</option>
                <option value="ready_to_move">Ready to Move</option>
                <option value="new_launched">New Launched</option>
                <option value="redeveloped">Redeveloped</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Location *</label>
            <div className={styles.locationSearchContainer}>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Search or select area"
                list="areasList"
                required
              />
              <datalist id="areasList">
                {AREAS_LIST.map(area => (
                  <option key={area} value={area} />
                ))}
              </datalist>
              <button
                type="button"
                onClick={() => setShowAddArea(!showAddArea)}
                className={styles.addAreaBtn}
              >
                + Add New
              </button>
            </div>
            {showAddArea && (
              <div className={styles.addAreaForm}>
                <input
                  type="text"
                  placeholder="Enter new area"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newArea) {
                      setFormData(prev => ({ ...prev, location: newArea }));
                      setNewArea('');
                      setShowAddArea(false);
                    }
                  }}
                  className={styles.confirmBtn}
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: NA Status & Certificate */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>NA (Non-Agricultural) Status</h2>

          <div className={styles.formGroup}>
            <label>NA Status *</label>
            <select
              name="naStatus"
              value={formData.naStatus}
              onChange={handleChange}
              required
            >
              <option value="obtained">Obtained</option>
              <option value="in_progress">In Progress</option>
              <option value="not_required">Not Required</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>NA Certificate (PDF/Image - Optional)</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(e, 'naCertificate')}
            />
            {files.naCertificate && (
              <p className={styles.fileName}>📄 {files.naCertificate.name}</p>
            )}
          </div>
        </div>

        {/* Section 3: Property Details */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Property Details</h2>

          <div className={styles.formGroup}>
            <label>Property Category (Fixed)</label>
            <input
              type="text"
              value="Apartment Blocks / High Rises"
              disabled
              className={styles.disabledInput}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Number of Floors *</label>
              <input
                type="number"
                name="numberOfFloors"
                value={formData.numberOfFloors}
                onChange={handleChange}
                placeholder="e.g., 30"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Wings (A, B, C... or 1, 2, 3...)</label>
              <input
                type="text"
                name="wings"
                value={formData.wings}
                onChange={handleChange}
                placeholder="e.g., A, B, C or 1, 2, 3"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Furnishing *</label>
            <select
              name="furnishing"
              value={formData.furnishing}
              onChange={handleChange}
              required
            >
              {FURNISHING_OPTIONS.map(option => (
                <option key={option} value={option.toLowerCase().replace(' ', '_')}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section 4: Layouts & Sizes */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Available Layouts</h2>
          <p className={styles.sectionDesc}>Select layouts available in this project</p>

          <div className={styles.layoutGrid}>
            {LAYOUT_OPTIONS.map(layout => (
              <div key={layout} className={styles.layoutCard}>
                <label className={styles.layoutCheckbox}>
                  <input
                    type="checkbox"
                    checked={formData.selectedLayouts.includes(layout)}
                    onChange={() => handleLayoutToggle(layout)}
                  />
                  <span className={styles.layoutLabel}>{layout}</span>
                </label>
                {formData.selectedLayouts.includes(layout) && (
                  <input
                    type="number"
                    placeholder="Size in sqft"
                    value={formData.layoutSizes[layout] || ''}
                    onChange={(e) => handleLayoutSizeChange(layout, e.target.value)}
                    className={styles.sizeInput}
                    required
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Nearby Station */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Nearby Railway Station</h2>

          <div className={styles.formGroup}>
            <select
              name="nearbyStation"
              value={formData.nearbyStation}
              onChange={handleChange}
            >
              <option value="">Select or Enter Station</option>
              {RAILWAY_STATIONS.map(station => (
                <option key={station} value={station}>
                  {station}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section 6: Key Highlights */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Why Choose This Property?</h2>
          <p className={styles.sectionDesc}>Select key highlights that make your project special</p>

          <KeyHighlightsSelector
            value={formData.keyHighlights}
            onChange={(highlights) => setFormData(prev => ({ ...prev, keyHighlights: highlights }))}
          />
        </div>

        {/* Section 7: Amenities */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Amenities</h2>
          <p className={styles.sectionDesc}>Select all amenities available in your project</p>

          <AmenitiesSelector
            value={formData.amenities}
            onChange={(amenities) => setFormData(prev => ({ ...prev, amenities: amenities }))}
          />
        </div>

        {/* Section 8: Media */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Project Images & Videos</h2>

          <div className={styles.formGroup}>
            <label>Project Images (Up to 10) *</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'images')}
            />
            <p className={styles.fileInfo}>
              {files.images.length}/10 images uploaded
            </p>
            <div className={styles.fileList}>
              {files.images.map((img, idx) => (
                <div key={idx} className={styles.fileItem}>
                  <span>{img.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile('images', idx)}
                    className={styles.removeBtn}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Project Videos (Up to 2)</label>
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={(e) => handleFileChange(e, 'videos')}
            />
            <p className={styles.fileInfo}>
              {files.videos.length}/2 videos uploaded
            </p>
            <div className={styles.fileList}>
              {files.videos.map((vid, idx) => (
                <div key={idx} className={styles.fileItem}>
                  <span>{vid.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile('videos', idx)}
                    className={styles.removeBtn}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className={styles.formActions}>
          <button
            type="button"
            onClick={() => router.back()}
            className={styles.cancelBtn}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? 'Launching Project...' : 'Launch Project'}
          </button>
        </div>
      </form>
    </div>
  );
}
