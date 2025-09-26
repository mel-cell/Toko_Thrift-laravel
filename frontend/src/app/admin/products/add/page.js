"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  nama_pakaian: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  deskripsi: z.string().min(10, { message: "Description must be at least 10 characters." }),
  harga: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Price must be a positive number." })
  ),
  stok: z.preprocess(
    (val) => Number(val),
    z.number().int().min(0, { message: "Stock must be a non-negative integer." })
  ),
  kategori_pakaian_id: z.string().uuid({ message: "Please select a category." }),
  gambar: z.any()
    .refine((file) => file?.length > 0, "Image is required.")
    .refine((file) => file?.[0]?.size <= 5000000, `Max image size is 5MB.`)
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

export default function AddProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categoriesData, error: categoriesError } = useSWR(
    "/api/admin/kategori-pakaians",
    fetcher
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_pakaian: "",
      deskripsi: "",
      harga: 0,
      stok: 0,
      kategori_pakaian_id: "",
      gambar: undefined,
    },
  });

  async function onSubmit(values) {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("nama_pakaian", values.nama_pakaian);
      formData.append("deskripsi", values.deskripsi);
      formData.append("harga", values.harga);
      formData.append("stok", values.stok);
      formData.append("kategori_pakaian_id", values.kategori_pakaian_id);
      formData.append("gambar", values.gambar[0]);

      const response = await fetcher.post("/api/admin/pakaians", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast({
          title: "Success!",
          description: "Product added successfully.",
        });
        router.push("/admin/products");
      } else {
        throw new Error(response.data?.message || "Failed to add product.");
      }
    } catch (error) {
      toast({
        title: "Error!",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (categoriesError) return <div>Failed to load categories: {categoriesError.message}</div>;
  if (!categoriesData) return <div>Loading categories...</div>;

  const categories = categoriesData.data || [];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="nama_pakaian"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deskripsi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter product description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="harga"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter price" {...field} onChange={event => field.onChange(+event.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stok"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter stock" {...field} onChange={event => field.onChange(+event.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="kategori_pakaian_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.nama_kategori}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gambar"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                  <Input
                    {...fieldProps}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(event) => onChange(event.target.files)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding Product..." : "Add Product"}
          </Button>
        </form>
      </Form>
    </div>
  );
}