"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ProductFormSchema } from "@/types/formschemas";
import RichTextEditor from "./RichTextEditor";
import ImageUploader from "./ImageUploader";
import { createMedication } from "@/actions/medication.actions";
import { toast } from "sonner";
import { Icons } from "./ui/icons";

interface ProductFormProps {
  type?: "add" | "edit";
  data?: z.infer<typeof ProductFormSchema>;
}

export default function ProductForm({ type = "add", data }: ProductFormProps) {
  const form = useForm<z.infer<typeof ProductFormSchema>>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues:
      type === "edit"
        ? data
        : {
            imageUrl: "",
            name: "",
            price: undefined,
            quantity: 0,
            description: "",
            sideEffects: "",
            details: "",
            usage: "",
            imageBlob: undefined,
          },
  });

  async function onSubmit(values: z.infer<typeof ProductFormSchema>) {
    const formData = new FormData();
    formData.append("imageBlob", values.imageBlob[0]);
    formData.append("name", values.name);
    formData.append("price", values.price.toPrecision(2));
    formData.append("quantity", values.quantity.toPrecision(2));
    formData.append("description", values.description);
    formData.append("sideEffects", values.sideEffects);
    formData.append("details", values.details);
    formData.append("usage", values.usage);

    const res = await createMedication(formData);

    if (!res.success) {
      toast.error(res.data);
      return;
    } else {
      toast.success("Successfully created medication");
      form.reset({
        imageUrl: "",
        name: "",
        price: undefined,
        quantity: 0,
        description: "",
        sideEffects: "",
        details: "",
        usage: "",
        imageBlob: undefined,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ImageUploader
                  setImageUrl={(url) => field.onChange(url)}
                  setError={(error) =>
                    form.setError("imageUrl", {
                      type: "custom",
                      message: error,
                    })
                  }
                  imageUrl={field.value}
                  setImageBlob={(blob) => form.setValue("imageBlob", [blob])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold" htmlFor="name">
                Product Name
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold" htmlFor="price">
                  Price
                </FormLabel>
                <FormControl>
                  <Input id="price" placeholder="Enter price" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold" htmlFor="quantity">
                  Quantity
                </FormLabel>
                <FormControl>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Enter quantity"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold" htmlFor="description">
                Description
              </FormLabel>
              <FormControl>
                <Textarea
                  id="description"
                  placeholder="Enter product description"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sideEffects"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold" htmlFor="sideEffects">
                Side Effects
              </FormLabel>
              <FormControl>
                <RichTextEditor onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold" htmlFor="details">
                Details
              </FormLabel>
              <FormControl>
                <RichTextEditor onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="usage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold" htmlFor="usage">
                Usage Instructions
              </FormLabel>
              <FormControl>
                <RichTextEditor onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </Form>
  );
}
