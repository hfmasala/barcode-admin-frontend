// frontend/src/components/forms/AddSkuForm.jsx

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // We need this
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// 1. Define the validation schema with Zod
const formSchema = z.object({
  name: z.string().min(3, {
    message: 'Name must be at least 3 characters.',
  }),
  sku_code: z.string().min(3, {
    message: 'SKU code must be at least 3 characters.',
  }),
  description: z.string().optional(),
});

export function AddSkuForm({ onSkuAdded, setOpen }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Define the form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      sku_code: '',
      description: '',
    },
  });

  // 3. Define the submit handler
  async function onSubmit(values) {
    setIsSubmitting(true);
    try {
      // Call the POST /api/skus endpoint
      const response = await api.post('/skus', values);
      
      toast.success('SKU Created!', {
        description: `"${response.data.name}" has been added.`,
      });
      
      onSkuAdded(); // This will refresh the SKU list
      setOpen(false); // This will close the sheet
      
    } catch (error) {
      console.error('Failed to create SKU:', error);
      const errorMsg = error.response?.data?.detail || 'Failed to create SKU.';
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
            {isSubmitting ? 'Saving...' : 'Save SKU'}
          </Button>
        </div>
      </form>
    </Form>
  );
}