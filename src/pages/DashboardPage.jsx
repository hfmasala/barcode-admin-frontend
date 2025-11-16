// frontend/src/pages/DashboardPage.jsx

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Package, Barcode, XCircle } from 'lucide-react'; // Icons

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    withBarcode: 0,
    withoutBarcode: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const response = await api.get('/skus');
        const skus = response.data;
        
        // Calculate stats
        const total = skus.length;
        const withBarcode = skus.filter(sku => sku.barcode).length;
        const withoutBarcode = total - withBarcode;

        setStats({ total, withBarcode, withoutBarcode });
        
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        toast.error('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Total SKUs Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SKUs</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-2xl font-bold">...</div>
            ) : (
              <div className="text-2xl font-bold">{stats.total}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Total products in the system
            </p>
          </CardContent>
        </Card>

        {/* SKUs with Barcodes Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              SKUs with Barcodes
            </CardTitle>
            <Barcode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-2xl font-bold">...</div>
            ) : (
              <div className="text-2xl font-bold">{stats.withBarcode}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Products ready for printing
            </p>
          </CardContent>
        </Card>

        {/* SKUs without Barcodes Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              SKUs without Barcodes
            </CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-2xl font-bold">...</div>
            ) : (
              <div className="text-2xl font-bold">{stats.withoutBarcode}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Products needing generation
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}