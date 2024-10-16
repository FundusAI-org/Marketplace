"use client";
import { Search } from "lucide-react";
import { FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Form, FormField } from "./ui/form";

interface SearchBarProps {
  goButton: boolean;
}

const formSchema = z.object({
  searchQuery: z.string(),
});

const SearchBar: FC<SearchBarProps> = ({ goButton }) => {
  const searchParams = useSearchParams();

  const { replace } = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchQuery: searchParams.get("query") || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const params = new URLSearchParams(searchParams);
    if (values.searchQuery) {
      params.set("query", values.searchQuery);
    }
    replace("/search" + "?" + params.toString());
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="ml-4">
        <FormField
          control={form.control}
          name="searchQuery"
          render={({ field }) => (
            <div className="relative">
              {goButton ? (
                <>
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground md:left-4 md:h-6 md:w-6" />
                  <Input
                    type="search"
                    placeholder="Search for medications..."
                    {...field}
                    className="w-full rounded-full py-4 pl-10 pr-4 text-base md:py-6 md:pl-12 md:text-xl"
                  />
                  <Button
                    type="submit"
                    className="absolute right-2 top-1/2 hidden -translate-y-1/2 transform rounded-full sm:flex md:px-6 md:text-base"
                  >
                    Search
                  </Button>
                  <Button
                    type="submit"
                    size={"sm"}
                    className="absolute right-1 top-1/2 flex -translate-y-1/2 transform rounded-full sm:hidden"
                  >
                    Search
                  </Button>
                </>
              ) : (
                <>
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search medications..."
                    {...field}
                    className="w-full pl-8 pr-4 md:w-[300px] lg:w-[400px]"
                  />
                </>
              )}
            </div>
          )}
        />
      </form>
    </Form>
  );
};

export default SearchBar;
