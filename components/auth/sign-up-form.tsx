import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import Link from "next/link";

const createUser = async (
  username: string,
  password: string,
  confirmPassword: string
) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ username, password, confirmPassword }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!");
  }

  return data;
};

const formSchema = z
  .object({
    username: z
      .string()
      .min(6, "Username must contain at least 6 characters")
      .max(50)
      .regex(/^\w+$/, {
        message: "Contains alpha numeric characters and underscore only.",
      }),
    password: z
      .string()
      .min(6, "Password must contain at least 6 characters")
      .max(50),
    confirmPassword: z
      .string()
      .min(6, "Password must contain at least 6 characters")
      .max(50),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match!",
    path: ["confirmPassword"],
  });

interface SignUpFormProps {}

const SignUpForm: React.FC<SignUpFormProps> = (props) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const submitHandler = async (values: z.infer<typeof formSchema>) => {
    try {
      const result = await createUser(
        values.username,
        values.password,
        values.confirmPassword
      );
      //  redirect to login
      console.log(result);
      router.push("/auth");
    } catch (err) {
      //  stay in form
      console.log(err);
    }
  };

  return (
    <Card className="bg-kingfisher-daisy/60 border-0 text-white rounded">
      <CardHeader className="text-center">
        <CardTitle className="font-space-grotesk text-3xl">Sign Up</CardTitle>
        <CardDescription className="text-white/60 text-base">
          Create an Account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitHandler)}
            className="space-y-8"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-space-grotesk text-base">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-space-grotesk text-base">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-space-grotesk text-base">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              className="w-full flex items-center"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign Up
            </Button>
          </form>
        </Form>
        <div className="text-center mt-6 ">
          Already have an account?{" "}
          <Link
            className="text-medium-red-violet hover:text-lavender-magenta"
            href="/auth"
          >
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignUpForm;
