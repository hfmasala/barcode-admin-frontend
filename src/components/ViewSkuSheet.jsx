// frontend/src/components/ViewSkuSheet.jsx

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Download, Printer } from 'lucide-react'; // <-- ADD PRINTER ICON
import api, { downloadFile } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

// Helper to fetch the image blob and create a displayable URL
async function getBarcodeImageUrl(skuId) {
  try {
    const response = await api.get(`/barcodes/${skuId}/png`, {
      responseType: 'blob',
    });
    return window.URL.createObjectURL(response.data);
  } catch (error) {
    console.error('Failed to load barcode image:', error);
    toast.error('Failed to load barcode image.');
    return null;
  }
}

export function ViewSkuSheet({ sku, open, onOpenChange }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (sku && open) {
      getBarcodeImageUrl(sku._id).then(setImageUrl);
    }
    
    return () => {
      if (imageUrl) {
        window.URL.revokeObjectURL(imageUrl);
      }
    };
  }, [sku, open]);

  if (!sku) return null;

  const handleDownload = async (type) => {
    let url, filename;
    const baseFilename = `${sku.sku_code}_${sku.barcode.ean13}`;

    if (type === 'png') {
      url = `/barcodes/${sku._id}/png`;
      filename = `${baseFilename}.png`;
    } else if (type === 'single_pdf') {
      url = `/barcodes/${sku._id}/pdf/single`;
      filename = `${baseFilename}_label.pdf`;
    } else if (type === 'a4_pdf') {
      url = `/barcodes/${sku._id}/pdf/a4`;
      filename = `${baseFilename}_A4.pdf`;
    }

    setIsDownloading(true);
    toast.loading(`Downloading ${filename}...`);

    try {
      await downloadFile(url, filename);
      toast.success(`Downloaded ${filename}!`);
    } catch (error) {
      toast.error(`Download failed: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  // --- NEW: Handle Thermal Print ---
  const handleThermalPrint = () => {
    // Open the new print route in a new tab
    window.open(`/print/sku/${sku._id}`, '_blank');
  };
  // --- END NEW ---

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          {/* <SheetTitle>{sku.name}</SheetTitle> */}
          <SheetTitle className="break-words">{sku.name}</SheetTitle>
          <SheetDescription>
            SKU Code: {sku.sku_code}
          </SheetDescription>
        </SheetHeader>
        <div className="py-6 space-y-6">
          {/* Barcode Display */}
          <div className="flex flex-col items-center justify-center p-4 border rounded-md">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`Barcode for ${sku.name}`}
                className="w-full max-w-xs"
              />
            ) : (
              <p>Loading barcode image...</p>
            )}
          </div>

          {/* Download Buttons */}
          <div className="space-y-2">
            <h4 className="font-semibold">Download & Print</h4>
            
            {/* --- NEW THERMAL PRINT BUTTON --- */}
            <Button
              className="w-full justify-start gap-2"
              onClick={handleThermalPrint}
              disabled={isDownloading}
            >
              <Printer className="h-4 w-4" /> Print (Thermal Label)
            </Button>
            {/* --- END NEW BUTTON --- */}
            
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => handleDownload('png')}
              disabled={isDownloading}
            >
              <Download className="h-4 w-4" /> Download PNG
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 break-words"
              onClick={() => handleDownload('single_pdf')}
              disabled={isDownloading}
            >
              <Download className="h-4 w-4 break-words" /> Download Single PDF (70x30mm)
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 break-words"
              onClick={() => handleDownload('a4_pdf')}
              disabled={isDownloading}
            >
              <Download className="h-4 w-4 break-words" /> Download A4 Sheet (Laser/Inkjet)
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}