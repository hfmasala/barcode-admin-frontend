// frontend/src/components/SkuMobileCard.jsx

import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function SkuMobileCard({ sku, processingSkuId, ...handlers }) {
  const {
    handleGenerateBarcode,
    handleViewSku,
    handleEditSku,
    handleOpenDeleteDialog,
  } = handlers;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {sku.name}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              disabled={sku.barcode || !!processingSkuId}
              onClick={() => handleGenerateBarcode(sku._id, sku.name)}
            >
              {sku.barcode ? 'Already Generated' : 'Generate Barcode'}
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!sku.barcode || !!processingSkuId}
              onClick={() => handleViewSku(sku)}
            >
              View/Download
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!!processingSkuId}
              onClick={() => handleEditSku(sku)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500"
              disabled={!!processingSkuId}
              onClick={() => handleOpenDeleteDialog(sku)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-xs text-muted-foreground">
          {sku.sku_code}
        </div>
        <div className="text-xs">
          Barcode:{' '}
          {sku.barcode ? (
            <span className="text-green-500">Generated</span>
          ) : processingSkuId === sku._id ? (
            <span className="text-blue-500">Generating...</span>
          ) : (
            <span className="text-yellow-500">No</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}