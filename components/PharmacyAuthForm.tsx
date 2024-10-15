"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";

import { cn } from "@/lib/utils";

import {
  LoginFormSchema,
  PharmacyRegisterFormSchema,
} from "@/types/formschemas";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Icons } from "./ui/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { signUp, signIn } from "@/actions/auth.actions";
import { toast } from "sonner";

export default function PharmacyAuthForm() {
  const params = useSearchParams();
  const { replace } = useRouter();

  const RegisterForm = useForm<z.infer<typeof PharmacyRegisterFormSchema>>({
    resolver: zodResolver(PharmacyRegisterFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const LoginForm = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function register(values: z.infer<typeof PharmacyRegisterFormSchema>) {
    const res = await signUp({ values, accountType: "pharmacy" });

    if (!res.success) {
      toast.error(res.error);
    } else {
      toast.success("Pharmacy registered successfully");
    }
  }

  async function login(values: z.infer<typeof LoginFormSchema>) {
    const res = await signIn(values);
    if ("error" in res) {
      toast.error(res.error);
    } else {
      toast.success("Logged in successfully");
    }
  }

  return (
    <Tabs
      defaultValue={params.get("action") ?? "login"}
      className="mx-auto w-[400px] p-4 sm:p-0"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger
          value="login"
          onClick={() => replace("/auth?role=pharmacy&action=login")}
        >
          Login
        </TabsTrigger>
        <TabsTrigger
          value="register"
          onClick={() => replace("/auth?role=pharmacy&action=register")}
        >
          Register
        </TabsTrigger>
      </TabsList>
      <TabsContent value="register">
        <Card>
          <CardHeader>
            <CardTitle>Register Pharmacy</CardTitle>
            <CardDescription>
              Create a pharmacy account to manage your inventory and orders.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className={cn("grid gap-6")}>
                <Form {...RegisterForm}>
                  <form
                    onSubmit={RegisterForm.handleSubmit(register)}
                    className="space-y-2"
                  >
                    <FormField
                      control={RegisterForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pharmacy Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter pharmacy name"
                              disabled={RegisterForm.formState.isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={RegisterForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="pharmacy@example.com"
                              type="email"
                              autoCapitalize="none"
                              autoComplete="email"
                              autoCorrect="off"
                              disabled={RegisterForm.formState.isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={RegisterForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter password"
                              type="password"
                              autoComplete="password"
                              disabled={RegisterForm.formState.isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={RegisterForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Confirm password"
                              autoComplete="confirmPassword"
                              type="password"
                              disabled={RegisterForm.formState.isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={RegisterForm.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
                              type="text"
                              autoComplete="state"
                              disabled={RegisterForm.formState.isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={RegisterForm.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
                              type="text"
                              autoComplete="zipCode"
                              disabled={RegisterForm.formState.isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={RegisterForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
                              type="text"
                              autoComplete="address"
                              disabled={RegisterForm.formState.isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={RegisterForm.formState.isSubmitting}
                    >
                      {RegisterForm.formState.isSubmitting ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Register Pharmacy"
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
              <p className="px-8 text-center text-sm text-muted-foreground">
                By clicking register, you agree to our{" "}
                <Link
                  href="/terms"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Pharmacy Login</CardTitle>
            <CardDescription>
              Log in to your pharmacy account to manage your inventory and
              orders.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className={cn("grid gap-6")}>
              <Form {...LoginForm}>
                <form
                  onSubmit={LoginForm.handleSubmit(login)}
                  className="space-y-2"
                >
                  <FormField
                    control={LoginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="pharmacy@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={LoginForm.formState.isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={LoginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter password"
                            type="password"
                            disabled={LoginForm.formState.isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={LoginForm.formState.isSubmitting}
                  >
                    {LoginForm.formState.isSubmitting ? (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
