// frontend/src/components/forms/EditSkuForm.jsx

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Validation schema (same as Add form)
const formSchema = z.object({
  name: z.string().min(3, {
    message: 'Name must be at least 3 characters.',
  }),
  sku_code: z.string().min(3, {
    message: 'SKU code must be at least 3 characters.',
  }),
  description: z.string().optional(),
});

export function EditSkuForm({ sku, onSkuUpdated, setOpen }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define the form
  const form = useForm({
    resolver: zodResolver(formSchema),
    // Pre-populate the form with the SKU's current data
    defaultValues: {
      name: sku.name,
      sku_code: sku.sku_code,
      description: sku.description || '',
    },
  });

  // Reset the form if the sku prop changes
  useEffect(() => {
    form.reset({
      name: sku.name,
      sku_code: sku.sku_code,
      description: sku.description || '',
    });
  }, [sku, form]);

  // Define the submit handler
  async function onSubmit(values) {
    setIsSubmitting(true);
    try {
      // Call the PUT /api/skus/{sku.id} endpoint
      const response = await api.put(`/skus/${sku._id}`, values);
      
      toast.success('SKU Updated!', {
        description: `"${response.data.name}" has been saved.`,
      });
      
      onSkuUpdated(); // This will refresh the SKU list
      setOpen(false); // This will close the sheet
      
    } catch (error) {
      console.error('Failed to update SKU:', error);
      const errorMsg = error.response?.data?.detail || 'Failed to update SKU.';
      toast.error('Error', {
        description: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Kashmiri Red Chilli 100g" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sku_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU Code</FormLabel>
              <FormControl>
                <Input placeholder="e.g., HF-KASH-100G" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Premium quality, low heat."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}