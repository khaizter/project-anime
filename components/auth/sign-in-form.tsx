import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/router";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  username: z.string().min(6).max(50),
  password: z.string().min(6).max(50),
});

const SignInForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const submitHandler = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        username: values.username,
        password: values.password,
      });
      if (result!.error) {
        setIsSubmitting(false);
        throw new Error(result!.error);
      }
      // successful login
      // redirect to home
      setIsSubmitting(false);
      router.replace("/home");
    } catch (err) {
      setIsSubmitting(false);
      console.log(err);
    }
  };

  return (
    <Card className="bg-kingfisher-daisy/60 border-0 text-white rounded">
      <CardHeader className="text-center">
        <CardTitle className="font-space-grotesk text-3xl">Sign In</CardTitle>
        <CardDescription className="text-white/60 text-base">
          Log in to your Account
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
            </div>
            <Button
              className="block w-full"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
            </Button>
          </form>
        </Form>
        <div className="text-center mt-6 ">
          Don&apos;t have an account?{" "}
          <Link
            className="text-medium-red-violet hover:text-lavender-magenta"
            href="/auth/signup"
          >
            Register
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignInForm;
