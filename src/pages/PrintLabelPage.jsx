// frontend/src/pages/PrintLabelPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/lib/api';

// This is the CSS that will be applied *only* when printing.
// It forces the page size to 70x30mm and removes all margins.
const printStyles = `
  @media print {
    @page {
      size: 70mm 30mm;
      margin: 0;
    }
    html, body {
      width: 70mm;
      height: 30mm;
      margin: 0;
      padding: 0;
    }
    .label-container {
      width: 100%;
      height: 100%;
      display: block;
      page-break-after: always;
    }
    /* Hide scrollbars or any other non-print elements */
    body {
      overflow: hidden;
    }
  }
`;

export default function PrintLabelPage() {
  const [sku, setSku] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);
  const { skuId } = useParams(); // Get the SKU ID from the URL

  useEffect(() => {
    if (!skuId) {
      setError('No SKU ID provided.');
      return;
    }

    async function fetchSkuAndImage() {
      try {
        // Fetch SKU details (for name, code, etc.)
        const skuResponse = await api.get(`/skus/${skuId}`);
        setSku(skuResponse.data);

        // Fetch the barcode image
        const imageResponse = await api.get(`/barcodes/${skuId}/png`, {
          responseType: 'blob',
        });
        const url = window.URL.createObjectURL(imageResponse.data);
        setImageUrl(url);

      } catch (err) {
        console.error('Failed to load label data:', err);
        setError('Failed to load label data.');
      }
    }

    fetchSkuAndImage();

    // Clean up the object URL
    return () => {
      if (imageUrl) {
        window.URL.revokeObjectURL(imageUrl);
      }
    };
  }, [skuId]);

  // Once the image has loaded, trigger the print dialog
  useEffect(() => {
    if (imageUrl) {
      window.print(); // Trigger the browser's print dialog
    }
  }, [imageUrl]);

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!sku || !imageUrl) {
    return <div className="p-4">Loading label for printing...</div>;
  }

  // This is the actual label content that will be printed
  return (
    <>
      <style>{printStyles}</style>
      <div className="label-container" style={{ width: '70mm', height: '30mm', padding: '3mm', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ fontSize: '10pt', fontWeight: 'bold', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {sku.name}
        </div>
        <div style={{ fontSize: '8pt', marginBottom: '2mm' }}>
          {sku.sku_code}
        </div>
        <div style={{ width: '100%', textAlign: 'center' }}>
          <img
            src={imageUrl}
            alt="Barcode"
            style={{ width: '60mm', height: '15mm', objectFit: 'contain' }}
            onLoad={() => {
              // This is a backup print trigger in case the one above fires too early
              if (!window.printing) {
                window.printing = true;
                window.print();
              }
            }}
          />
        </div>
      </div>
    </>
  );
}