// frontend/src/pages/SkuListPage.jsx

import React, { useEffect, useState } from 'react';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'; 

import { AddSkuForm } from '@/components/forms/AddSkuForm';
import { EditSkuForm } from '@/components/forms/EditSkuForm';
import { ViewSkuSheet } from '@/components/ViewSkuSheet';
import { SkuMobileCard } from '@/components/SkuMobileCard'; // <-- IMPORT THE NEW MOBILE CARD

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


export default function SkuListPage() {
  const [skus, setSkus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [processingSkuId, setProcessingSkuId] = useState(null);
  const [viewingSku, setViewingSku] = useState(null);
  const [editingSku, setEditingSku] = useState(null);
  const [deletingSku, setDeletingSku] = useState(null);

  const fetchSkus = async () => {
    try {
      const response = await api.get('/skus');
      setSkus(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch SKUs:', err);
      setError('Failed to fetch SKUs. Please try again.');
      toast.error('Failed to fetch SKUs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAddSheetOpen && !viewingSku && !editingSku && !deletingSku) {
       fetchSkus();
    }
  }, [isAddSheetOpen, viewingSku, editingSku, deletingSku]);

  const handleGenerateBarcode = async (skuId, skuName) => {
    setProcessingSkuId(skuId);
    const toastId = toast.loading(`Generating barcode for ${skuName}...`);
    try {
      await api.post('/barcodes/generate', { sku_id: skuId, output: 'png' });
      toast.success('Barcode Generated!', { id: toastId, description: `${skuName} now has a barcode.` });
      fetchSkus();
    } catch (error) {
      console.error('Failed to generate barcode:', error);
      toast.error('Error', { id: toastId, description: `Failed to generate barcode: ${error.message}` });
    } finally {
      setProcessingSkuId(null);
    }
  };
  
  const handleViewSku = (sku) => { setViewingSku(sku); };
  const handleEditSku = (sku) => { setEditingSku(sku); };
  const handleOpenDeleteDialog = (sku) => { setDeletingSku(sku); };

  const confirmDeleteSku = async () => {
    if (!deletingSku) return;
    setProcessingSkuId(deletingSku._id); 
    const toastId = toast.loading(`Deleting ${deletingSku.name}...`);
    try {
      await api.delete(`/skus/${deletingSku._id}`);
      toast.success('SKU Deleted!', { id: toastId, description: `${deletingSku.name} has been permanently deleted.` });
      setDeletingSku(null); 
      fetchSkus(); 
    } catch (error) {
      console.error('Failed to delete SKU:', error);
      toast.error('Error', { id: toastId, description: `Failed to delete SKU: ${error.message}` });
    } finally {
      setProcessingSkuId(null);
    }
  };

  // Group all handlers to pass to mobile card
  const actionHandlers = {
    handleGenerateBarcode,
    handleViewSku,
    handleEditSku,
    handleOpenDeleteDialog,
  };

  return (
    <div>
      {/* --- ALL SHEETS AND DIALOGS --- */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="break-words">Add a New SKU</SheetTitle>
            <SheetDescription className="break-words">Enter the details for the new product.</SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <AddSkuForm onSkuAdded={() => { fetchSkus(); setIsAddSheetOpen(false); }} setOpen={setIsAddSheetOpen} />
          </div>
        </SheetContent>
      </Sheet>

      <ViewSkuSheet sku={viewingSku} open={!!viewingSku} onOpenChange={(isOpen) => { if (!isOpen) setViewingSku(null); }} />

      <Sheet open={!!editingSku} onOpenChange={(isOpen) => { if (!isOpen) setEditingSku(null); }}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="break-words">Edit SKU</SheetTitle>
            <SheetDescription className="break-words">Update the details for this product.</SheetDescription>
          </SheetHeader>
          <div className="py-4">
            {editingSku && (
              <EditSkuForm sku={editingSku} onSkuUpdated={() => { fetchSkus(); setEditingSku(null); }} setOpen={() => setEditingSku(null)} />
            )}
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deletingSku} onOpenChange={(isOpen) => { if (!isOpen) setDeletingSku(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the SKU
              <strong className="ml-1 mr-1">"{deletingSku?.name}"</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!processingSkuId}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteSku} disabled={!!processingSkuId} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {processingSkuId === deletingSku?._id ? 'Deleting...' : 'Yes, delete it'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* --- END SHEETS AND DIALOGS --- */}


      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                A list of all products and their barcode status.
              </CardDescription>
            </div>
            <Button size="sm" className="h-8 gap-1" onClick={() => setIsAddSheetOpen(true)}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add new SKU
              </span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* --- RESPONSIVE LOGIC --- */}
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : skus.length > 0 ? (
            <>
              {/* --- DESKTOP TABLE (Hidden on mobile) --- */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>SKU Code</TableHead>
                      <TableHead>Barcode</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {skus.map((sku) => (
                      <TableRow key={sku._id}>
                        <TableCell className="font-medium">{sku.name}</TableCell>
                        <TableCell>{sku.sku_code}</TableCell>
                        <TableCell>
                          {sku.barcode ? <span className="text-green-500">Generated</span> : (processingSkuId === sku._id ? <span className="text-blue-500">Generating...</span> : <span className="text-yellow-500">No</span>)}
                        </TableCell>
                        <TableCell>{new Date(sku.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4 text-black dark:text-gray-400" /><span className="sr-only">Toggle menu</span></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem disabled={sku.barcode || !!processingSkuId} onClick={() => handleGenerateBarcode(sku._id, sku.name)}>{sku.barcode ? 'Already Generated' : 'Generate Barcode'}</DropdownMenuItem>
                              <DropdownMenuItem disabled={!sku.barcode || !!processingSkuId} onClick={() => handleViewSku(sku)}>View/Download</DropdownMenuItem>
                              <DropdownMenuItem disabled={!!processingSkuId} onClick={() => handleEditSku(sku)}>Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-500" disabled={!!processingSkuId} onClick={() => handleOpenDeleteDialog(sku)}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* --- MOBILE CARD LIST (Hidden on desktop) --- */}
              <div className="grid gap-4 md:hidden">
                {skus.map((sku) => (
                  <SkuMobileCard 
                    key={sku._id} 
                    sku={sku} 
                    processingSkuId={processingSkuId} 
                    {...actionHandlers} 
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center">No SKUs found.</div>
          )}
          {/* --- END RESPONSIVE LOGIC --- */}
        </CardContent>
      </Card>
    </div>
  );
}